-- Migration : parrainage waitlist + scaling mois gratuits
-- Date : 2026-05-15
-- Description : ajoute le système de parrainage à la waitlist.
-- Chaque inscrit obtient un code unique qu'il peut partager.
-- Les filleuls s'inscrivent avec ce code (referred_by lie au parrain).
--
-- Récompense : 2 mois gratuits de base + 1 mois par filleul, plafond 12 mois (10 filleuls).
-- Le nombre de mois est stocké sur profiles.launch_promo_months et calculé au moment
-- du register (lecture de waitlist + comptage des filleuls).
--
-- Strictement additive — aucune ligne existante n'est modifiée.

alter table waitlist
  add column if not exists referral_code text,
  add column if not exists referred_by text;

create unique index if not exists waitlist_referral_code_unique
  on waitlist(referral_code) where referral_code is not null;

create index if not exists waitlist_referred_by_idx on waitlist(referred_by);

alter table profiles
  add column if not exists launch_promo_months int;

comment on column waitlist.referral_code is 'Code de parrainage unique généré à l''inscription waitlist (ex: ABC123)';
comment on column waitlist.referred_by is 'Code de parrainage du parrain qui a amené cet inscrit (référence à waitlist.referral_code)';
comment on column profiles.launch_promo_months is 'Nombre de mois d''abonnement offerts à l''ouverture publique (2 base + 1 par filleul, plafond 12). NULL = pas de promo.';
