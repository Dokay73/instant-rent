-- =====================================================================
-- SECURITY HARDENING — 2026-07-11
-- Corrige les alertes du Security Advisor Supabase + fuites confirmées
-- par test réel avec la clé anon (publique).
--
-- 🔴 CRITIQUE corrigé ici : le bucket privé `documents` (pièces d'identité,
--    justificatifs, diagnostics) était LISTABLE et TÉLÉCHARGEABLE par
--    n'importe qui possédant la clé anon. Cause : policy SELECT trop
--    permissive sur storage.objects.
--
-- NON destructif pour l'app :
--   • Lectures légitimes = signed URLs générées côté serveur en service_role
--     (app/api/get-doc, generate-bail…) → indépendantes des policies.
--   • Affichage des photos = bucket public `property-images` servi via la
--     route /object/public/ → ne nécessite AUCUNE policy SELECT.
--   • Uploads = tous sous `${auth.uid()}/…` (vérifié) → policies scopées OK.
-- =====================================================================

-- ---------- 1) STORAGE : remise à plat des policies storage.objects ----------
-- On repart d'une base saine (2 buckets seulement : property-images, documents).
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- property-images (bucket PUBLIC) : affichage public via /object/public/ (sans policy).
-- On autorise uniquement le propriétaire à gérer SES fichiers. Pas de SELECT anon
-- → plus d'énumération/listing (corrige "Public Bucket Allows Listing").
CREATE POLICY "prop_images_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "prop_images_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "prop_images_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- documents (bucket PRIVÉ) : AUCUN accès anon. L'utilisateur ne touche que SON dossier.
-- Les lectures applicatives passent par signed URL (service_role) → non impactées.
CREATE POLICY "documents_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "documents_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "documents_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "documents_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- 2) PROPERTIES : ne plus exposer les brouillons ----------
-- La SELECT en place laissait voir is_published=false NON SEULEMENT en anonyme mais
-- AUSSI à tout utilisateur connecté (confirmé en live). On remet donc TOUTES les
-- policies de properties à plat et on recrée le jeu complet et correct.
-- (On s'assure d'abord que RLS est bien ACTIVÉ, sinon les policies seraient inertes.)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'properties'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.properties', pol.policyname); END LOOP;
END $$;

-- Lecture : biens publiés visibles de tous ; le propriétaire voit EN PLUS ses brouillons.
CREATE POLICY "properties_read_published_or_own" ON public.properties
  FOR SELECT TO anon, authenticated
  USING (is_published = true OR owner_id = auth.uid());

-- Le propriétaire gère (crée / modifie / supprime) uniquement SES biens.
CREATE POLICY "properties_insert_own" ON public.properties
  FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "properties_update_own" ON public.properties
  FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "properties_delete_own" ON public.properties
  FOR DELETE TO authenticated USING (owner_id = auth.uid());

-- ---------- 3) FONCTION handle_new_user : search_path figé + EXECUTE révoqué ----------
-- Corrige "Function Search Path Mutable" + "Public/Signed-in Can Execute SECURITY DEFINER".
-- On fige à `public` (et non `''`) : la fonction (trigger de création de profil) référence
-- probablement `profiles` sans préfixe de schéma ; un search_path vide casserait les
-- inscriptions. `public` est immutable (satisfait le linter) ET garde les tables résolvables.
-- (REVOKE sans risque : un trigger s'exécute indépendamment du droit EXECUTE direct.)
ALTER FUNCTION public.handle_new_user() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- ---------- 4) APPLICATIONS : empêcher un locataire de s'auto-valider ----------
-- Faille (confirmée en live) : la policy UPDATE laissait le locataire changer `status`
-- lui-même → 'validated' sans paiement, puis génération d'un bail exposant la PII du
-- bailleur. On remet à plat les policies et on recrée un jeu correct.
-- (Toutes les transitions 'validated'/'ended' passent par le service_role, hors RLS ;
--  seul le rejet 'rejected' côté propriétaire reste en RLS.)
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='applications'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.applications', pol.policyname); END LOOP;
END $$;

-- Lecture : le locataire voit ses candidatures ; le propriétaire celles de ses biens.
CREATE POLICY "applications_select" ON public.applications
  FOR SELECT TO authenticated
  USING (
    tenant_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid())
  );

-- Création : le locataire candidate pour lui-même, uniquement à l'état 'pending'.
CREATE POLICY "applications_insert_own" ON public.applications
  FOR INSERT TO authenticated
  WITH CHECK (tenant_id = auth.uid() AND status = 'pending');

-- Mise à jour : le propriétaire peut UNIQUEMENT rejeter une candidature EN ATTENTE de son
-- bien (pas rebasculer en 'rejected' une candidature déjà validée/payée → désync de l'état).
CREATE POLICY "applications_owner_reject" ON public.applications
  FOR UPDATE TO authenticated
  USING (
    status = 'pending'
    AND EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid())
  )
  WITH CHECK (
    status = 'rejected'
    AND EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid())
  );

-- ---------- 5) CONTRACTS : unicité (1 bail par candidature) ----------
-- Empêche qu'un webhook Stripe rejoué crée un 2e contrat (→ 'multiple rows' qui
-- casse generate-bail/sign-bail). Sûr : aucun doublon existant (vérifié).
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contracts_application_id_key') THEN
    ALTER TABLE public.contracts ADD CONSTRAINT contracts_application_id_key UNIQUE (application_id);
  END IF;
END $$;

-- ---------- 6) SUBSCRIPTIONS : unicité (pas de double facturation) ----------
-- (a) stripe_sub_id unique — un event rejoué ne recrée pas d'abonnement.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_stripe_sub_id_key') THEN
    ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_stripe_sub_id_key UNIQUE (stripe_sub_id);
  END IF;
END $$;
-- (b) un seul abonnement ACTIF par bien — bloque le double checkout concurrent.
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_one_active_per_property
  ON public.subscriptions (property_id) WHERE is_active;

-- ---------- 7) STRIPE_EVENTS : table d'idempotence du webhook ----------
-- Le webhook insère event.id ; un rejeu (conflit PK) est acquitté sans retraitement.
CREATE TABLE IF NOT EXISTS public.stripe_events (
  event_id text PRIMARY KEY,
  type text,
  received_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
-- Aucune policy → seul le service_role (le webhook) y accède ; anon/authenticated bloqués.

-- ---------- 8) NOM DU PROPRIÉTAIRE des biens publiés (fonction limitée) ----------
-- Le join profiles(full_name) renvoie NULL aux visiteurs non-propriétaires (RLS) →
-- "Publié par [vide]". On expose UNIQUEMENT le nom, et UNIQUEMENT pour un bien publié,
-- via une fonction SECURITY DEFINER (jamais une policy RLS sur profiles, qui fuiterait
-- birth_date / id_card_url / monthly_income / etc.).
CREATE OR REPLACE FUNCTION public.get_published_owner_name(prop_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT pr.full_name
  FROM public.properties p
  JOIN public.profiles pr ON pr.id = p.owner_id
  WHERE p.id = prop_id AND p.is_published = true
$$;
REVOKE EXECUTE ON FUNCTION public.get_published_owner_name(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_published_owner_name(uuid) TO anon, authenticated;

-- =====================================================================
-- RESTE À FAIRE HORS SQL (dashboard) :
--   • Auth → Providers/Passwords → activer "Leaked password protection"
--     (vérifie les mots de passe contre HaveIBeenPwned). 1 clic.
-- =====================================================================
