-- =====================================================================
-- RÉDUCTION PARRAINAGE — 2026-07-16 (complément success-fee)
-- Le parrainage n'offre plus de « mois gratuits » (plus d'abonnement) mais un
-- CRÉDIT € sur le forfait (50 €/filleul, plafond 500 €). Le crédit est un solde
-- consommé au fil des placements. On enregistre le montant de crédit consommé
-- sur CHAQUE placement pour (a) l'audit, (b) calculer le solde restant.
--
-- NON destructif : un seul ADD COLUMN IF NOT EXISTS.
-- =====================================================================
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS fee_discount_cents integer;
