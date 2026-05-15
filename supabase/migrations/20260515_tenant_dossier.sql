-- Migration : dossier locataire persistant
-- Date : 2026-05-15
-- Description : ajoute les champs nécessaires au dossier locataire centralisé,
-- pour que le locataire dépose ses docs une seule fois et les réutilise
-- sur toutes ses candidatures.
--
-- Strictement additive — aucune ligne existante n'est modifiée.
-- Rollback possible avec DROP COLUMN si besoin.

alter table profiles
  add column if not exists work_contract_url text,
  add column if not exists proof_of_address_url text,
  add column if not exists monthly_income numeric(10,2),
  add column if not exists professional_status text,
  add column if not exists employer_name text,
  add column if not exists current_situation text,
  add column if not exists dossier_updated_at timestamptz;

comment on column profiles.work_contract_url is 'Path Supabase Storage bucket "documents" — contrat de travail ou justif activité';
comment on column profiles.proof_of_address_url is 'Path Supabase Storage bucket "documents" — justificatif de domicile actuel';
comment on column profiles.monthly_income is 'Revenu mensuel net déclaré par le locataire (en euros)';
comment on column profiles.professional_status is 'CDI, CDD, Freelance, Étudiant, Retraité, Recherche emploi, Autre';
comment on column profiles.employer_name is 'Nom employeur ou activité (optionnel)';
comment on column profiles.current_situation is 'Explication contexte location (mobilité pro, étudiant alternance, résidence secondaire, etc.) — utile pour qualifier le bail';
comment on column profiles.dossier_updated_at is 'Timestamp dernière mise à jour du dossier locataire';
