-- =====================================================================
-- SECURITY HARDENING 2 — 2026-08-01
-- Suite de l'audit sécu. NON destructif (ADD COLUMN IF NOT EXISTS, trigger).
-- =====================================================================

-- ---------- #2 : anti-farming du crédit parrainage ----------
-- Le crédit (50 €/filleul, plafond 500 €) ne doit compter que les filleuls qui
-- ont réellement créé un compte, pas de simples emails ajoutés à la waitlist.
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS converted boolean NOT NULL DEFAULT false;

-- Backfill : les inscrits qui ont DÉJÀ un compte auth sont "convertis".
UPDATE public.waitlist w
  SET converted = true
  WHERE converted = false
    AND EXISTS (SELECT 1 FROM auth.users u WHERE lower(u.email) = lower(w.email));

-- ---------- #3 : verrou colonnes sensibles de profiles (anti mass-assignment) ----------
-- La policy RLS UPDATE restreint la LIGNE (id = auth.uid) mais pas les COLONNES.
-- Ce trigger empêche un client (authenticated) d'écrire les colonnes réservées au
-- serveur. Le service_role (routes serveur, ex. checkout) passe librement.
CREATE OR REPLACE FUNCTION public.protect_profiles_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Le serveur (service_role) a tous les droits.
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;
  -- Client : on neutralise toute tentative de modifier ces colonnes financières/promo.
  NEW.stripe_customer_id  := OLD.stripe_customer_id;
  NEW.launch_promo_months := OLD.launch_promo_months;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_protect_profiles ON public.profiles;
CREATE TRIGGER trg_protect_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profiles_columns();

-- =====================================================================
-- APRÈS APPLICATION : le crédit parrainage passe en mode "converti seulement"
-- (le code checkout filtre déjà .eq('converted', true), fail-safe à 0 sinon).
-- =====================================================================
