-- =====================================================================
-- SUCCESS FEE BILLING — 2026-07-16
-- Pivot tarifaire : abonnement 29 €/mois → forfait UNIQUE prélevé à la
-- signature du bail (290 / 390 / 490 € selon loyer ; offre pionnier 0/199 €).
--
-- Mécanique :
--   1) Validation du candidat → on enregistre la CARTE du proprio via un
--      Checkout `mode:setup` (0 € prélevé). La ligne `subscriptions` devient
--      le REGISTRE DE PLACEMENT (on garde le nom de table pour ne pas casser
--      cancel-subscription / delete-account / RLS).
--   2) Signature du bail (webhook Documenso) → prélèvement off-session du
--      forfait FIGÉ à l'étape 1, sur la carte enregistrée.
--
-- NON destructif : uniquement des ADD COLUMN IF NOT EXISTS, un DROP NOT NULL
-- (assouplissement), des index/tables IF NOT EXISTS. Aucune donnée touchée.
-- ⚠️ Faire un snapshot Supabase avant d'appliquer (garde-fou migration).
-- =====================================================================

-- ---------- 1) SUBSCRIPTIONS → registre de placement + suivi paiement ----------
-- Colonnes ajoutées pour le modèle success-fee. Les anciennes colonnes
-- (stripe_sub_id, is_active, started_at, ended_at) restent en place.
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS landlord_id              uuid,
  ADD COLUMN IF NOT EXISTS application_id           uuid,
  ADD COLUMN IF NOT EXISTS stripe_customer_id       text,
  ADD COLUMN IF NOT EXISTS stripe_payment_method_id text,
  ADD COLUMN IF NOT EXISTS stripe_setup_session_id  text,
  ADD COLUMN IF NOT EXISTS fee_amount_cents         integer,
  ADD COLUMN IF NOT EXISTS fee_tier                 text,
  ADD COLUMN IF NOT EXISTS payment_status           text,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS paid_at                  timestamptz;

-- En mode `setup` il n'y a PLUS d'abonnement Stripe → stripe_sub_id peut être NULL.
-- (Sa contrainte UNIQUE reste : en Postgres, plusieurs NULL sont autorisés.)
ALTER TABLE public.subscriptions ALTER COLUMN stripe_sub_id DROP NOT NULL;

-- Statuts de paiement autorisés (NULL toléré pour les anciennes lignes d'abo).
--   pending          = carte enregistrée, forfait pas encore prélevé (avant signature)
--   waived           = 0 € (pionnier, 1er placement offert) → rien à prélever
--   processing       = PaymentIntent en cours
--   paid             = forfait encaissé
--   action_required  = prélèvement off-session a demandé une auth (SCA) → relance proprio
--   failed           = carte refusée / échec → relance proprio
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_payment_status_chk') THEN
    ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_payment_status_chk
      CHECK (payment_status IS NULL OR payment_status IN
        ('pending','waived','processing','paid','action_required','failed'));
  END IF;
END $$;

-- Idempotence de l'insert de placement : un event Checkout rejoué (même session)
-- ne crée pas 2 lignes. Index partiel (les anciennes lignes d'abo ont NULL ici).
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_setup_session_uniq
  ON public.subscriptions (stripe_setup_session_id)
  WHERE stripe_setup_session_id IS NOT NULL;

-- Rappel : l'index `subscriptions_one_active_per_property` (migration 2026-07-11)
-- reste LE verrou de départage atomique entre 2 candidats sur un même bien.

-- ---------- 2) PROFILES → client Stripe réutilisable par proprio ----------
-- Un seul Stripe Customer par propriétaire (regroupe cartes + paiements).
-- Peuplé côté serveur (service_role) ; jamais écrit par le client.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- ---------- 3) PIONEERS → allowlist inforgeable des « 50 premiers » ----------
-- L'offre pionnier (1er placement offert, puis 199 € à vie) ne doit JAMAIS
-- pouvoir être auto-attribuée par le proprio. On la stocke dans une table
-- SANS policy RLS → seul le service_role (routes serveur) y accède ; anon &
-- authenticated sont bloqués (même posture que stripe_events).
CREATE TABLE IF NOT EXISTS public.pioneers (
  landlord_id uuid PRIMARY KEY,
  email       text,
  added_at    timestamptz NOT NULL DEFAULT now(),
  note        text
);
ALTER TABLE public.pioneers ENABLE ROW LEVEL SECURITY;
-- Aucune policy volontairement : lecture/écriture réservées au service_role.

-- =====================================================================
-- APRÈS APPLICATION (ops, hors SQL) :
--   • Peupler `pioneers` au fil de l'onboarding des 50 premiers proprios.
--   • Vercel : ajouter les clés Stripe TEST sur un environnement de preview
--     pour le test bout-en-bout avant bascule prod.
-- =====================================================================
