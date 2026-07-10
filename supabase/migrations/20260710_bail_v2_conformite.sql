-- Migration bail v2 — conformité légale (MISSION LEGAL-001, arbitrages D1-D8 du 2026-07-10)
-- Nouvelles colonnes uniquement, aucune donnée existante modifiée, réversible (DROP COLUMN).

-- Bien : diagnostics obligatoires (DPE annexé, ERP < 6 mois, CREP si < 1949) + révision IRL
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS construction_year integer,
  ADD COLUMN IF NOT EXISTS dpe_pdf_url text,
  ADD COLUMN IF NOT EXISTS erp_pdf_url text,
  ADD COLUMN IF NOT EXISTS erp_date date,
  ADD COLUMN IF NOT EXISTS crep_pdf_url text,
  ADD COLUMN IF NOT EXISTS crep_date date,
  ADD COLUMN IF NOT EXISTS rent_revision boolean NOT NULL DEFAULT false;

-- Candidature : dossier anti-requalification (motif d'occupation + déclaration horodatée)
ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS occupancy_reason text
    CHECK (occupancy_reason IS NULL OR occupancy_reason IN
      ('sejour_professionnel', 'double_residence', 'formation_etudes', 'autre')),
  ADD COLUMN IF NOT EXISTS main_residence_declared_at timestamptz;

-- Contrat : date de prise d'effet choisie par les parties + page de signature +
-- attestation d'assurance (remise des clés) + signature DocuSeal (remplace Yousign,
-- décision 2026-07-10) + archivage du dossier de preuve
ALTER TABLE contracts
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS signature_page integer,
  ADD COLUMN IF NOT EXISTS insurance_attestation_url text,
  ADD COLUMN IF NOT EXISTS docuseal_submission_id text,
  ADD COLUMN IF NOT EXISTS audit_log_url text;
