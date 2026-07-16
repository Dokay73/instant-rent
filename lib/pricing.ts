// =====================================================================
// MOTEUR DE FACTURATION — forfait unique « success fee » (pivot 2026-07)
// ---------------------------------------------------------------------
// Modèle : 0 € tant que le bien n'est pas loué. Un forfait UNIQUE est dû
// le jour où le bail est signé (prélevé sur la carte enregistrée à la
// validation du candidat). Aucune commission sur les loyers, aucun abo.
//
// Ce fichier est PUR (aucune dépendance Stripe/Supabase) → 100 % testable
// en isolation. Le montant est calculé et FIGÉ à la validation du candidat,
// puis simplement prélevé à la signature (on ne recalcule pas au prélèvement,
// pour que le proprio paie exactement le prix affiché au moment où il s'engage).
// =====================================================================

// Montants en CENTIMES (unité Stripe). Les 3 paliers de la page /tarifs.
export const FEE_LOW_CENTS = 29000 // 290 € — loyer < 1 200 €
export const FEE_MID_CENTS = 39000 // 390 € — loyer 1 200–2 200 €
export const FEE_HIGH_CENTS = 49000 // 490 € — loyer > 2 200 €

// Bornes de palier (en euros/mois). Doivent rester synchronisées avec les
// libellés de app/tarifs/page.tsx (TIERS).
export const TIER_LOW_MAX = 1200 // < 1200 → palier bas
export const TIER_MID_MAX = 2200 // 1200..2200 inclus → palier moyen ; au-delà → palier haut

// Offre pionnier (« les 50 premiers ») : 1er placement offert, puis 199 € à vie.
export const PIONEER_FIRST_CENTS = 0 // 1er placement offert
export const PIONEER_NEXT_CENTS = 19900 // 199 € les placements suivants

// Base de calcul du palier : loyer HORS charges (`rent_hc`).
// Choix : c'est « le loyer » au sens légal (les charges sont un accessoire
// variable) et c'est un poil plus doux pour le proprio. Pour basculer sur le
// loyer charges comprises, passer à 'cc' — c'est l'unique point à changer.
export const FEE_BASIS: 'hc' | 'cc' = 'hc'

export type FeeTier = '290' | '390' | '490' | 'pioneer_first' | 'pioneer_next'

export interface ServiceFee {
  /** Montant NET réellement prélevé (après réduction parrainage). */
  amountCents: number
  /** Forfait BRUT avant réduction (palier ou pionnier). Pour l'audit/affichage. */
  grossAmountCents: number
  /** Réduction parrainage effectivement appliquée sur ce forfait. */
  discountCents: number
  tier: FeeTier
  /** Libellé humain (emails, dashboard, metadata Stripe). */
  label: string
}

/**
 * Palier standard (non-pionnier) selon le loyer mensuel de référence.
 * < 1200 → 290 € · 1200–2200 → 390 € · > 2200 → 490 €
 */
export function standardTier(rentEuros: number): { amountCents: number; tier: '290' | '390' | '490' } {
  if (rentEuros < TIER_LOW_MAX) return { amountCents: FEE_LOW_CENTS, tier: '290' }
  if (rentEuros <= TIER_MID_MAX) return { amountCents: FEE_MID_CENTS, tier: '390' }
  return { amountCents: FEE_HIGH_CENTS, tier: '490' }
}

export interface ComputeFeeInput {
  /** Loyer hors charges du bien (€/mois). */
  rentHc: number
  /** Charges (€/mois). Utilisé seulement si FEE_BASIS === 'cc'. */
  charges?: number
  /** Le proprio fait-il partie des pionniers (table `pioneers`, inforgeable) ? */
  isPioneer: boolean
  /** Nombre de placements DÉJÀ facturés par ce proprio (pour « 1er offert »). */
  priorPlacementCount: number
  /** Crédit parrainage DISPONIBLE (gagné − déjà consommé), en centimes. */
  availableCreditCents?: number
}

/** Palier/pionnier BRUT, avant toute réduction parrainage. */
function grossFee(input: ComputeFeeInput): { grossAmountCents: number; tier: FeeTier } {
  const { rentHc, charges = 0, isPioneer, priorPlacementCount } = input
  if (isPioneer) {
    if (priorPlacementCount <= 0) return { grossAmountCents: PIONEER_FIRST_CENTS, tier: 'pioneer_first' }
    return { grossAmountCents: PIONEER_NEXT_CENTS, tier: 'pioneer_next' }
  }
  const rentEuros = FEE_BASIS === 'cc' ? rentHc + charges : rentHc
  const { amountCents, tier } = standardTier(rentEuros)
  return { grossAmountCents: amountCents, tier }
}

/**
 * Calcule le forfait dû pour un placement donné. Appelé à la validation du
 * candidat, le résultat est FIGÉ (snapshot) dans la ligne de placement.
 * Applique la réduction parrainage disponible, plafonnée au montant du forfait.
 */
export function computeServiceFee(input: ComputeFeeInput): ServiceFee {
  const { grossAmountCents, tier } = grossFee(input)
  const available = Math.max(input.availableCreditCents ?? 0, 0)
  const discountCents = Math.min(available, grossAmountCents)
  const amountCents = grossAmountCents - discountCents

  const labelBase = tier === 'pioneer_first'
    ? '1er placement offert (pionnier)'
    : tier === 'pioneer_next'
      ? 'Forfait pionnier (199 €)'
      : `Forfait placement (${grossAmountCents / 100} €)`
  const label = discountCents > 0 ? `${labelBase} − ${discountCents / 100} € parrainage` : labelBase

  return { amountCents, grossAmountCents, discountCents, tier, label }
}

/** Formatage FR d'un montant en centimes → « 290 € » / « 0 € ». */
export function formatCents(cents: number): string {
  return `${(cents / 100).toLocaleString('fr-FR')} €`
}
