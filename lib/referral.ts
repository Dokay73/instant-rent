const REFERRAL_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // exclut O, 0, I, 1 pour éviter confusion
const REFERRAL_LENGTH = 6

export function generateReferralCode(): string {
  let code = ''
  for (let i = 0; i < REFERRAL_LENGTH; i++) {
    code += REFERRAL_CHARS[Math.floor(Math.random() * REFERRAL_CHARS.length)]
  }
  return code
}

// =====================================================================
// PARRAINAGE → CRÉDIT € SUR LE FORFAIT (pivot success-fee 2026-07)
// ---------------------------------------------------------------------
// L'ancien modèle offrait des « mois d'abonnement ». Sans abonnement, le
// parrainage rapporte désormais une RÉDUCTION en euros sur le forfait de
// mise en location : 50 € par filleul inscrit, cumulables, plafond 500 €
// (soit un gros forfait — jusqu'à 490 € — potentiellement 100 % offert).
// Le crédit est un solde : il se consomme au fil des forfaits (cf. lib/pricing).
// =====================================================================
export const REFERRAL_CREDIT_PER_SIGNUP = 50 // € par filleul inscrit
export const MAX_REFERRAL_CREDIT = 500 // € plafond (10 filleuls)

/** Crédit total GAGNÉ (avant consommation) pour un nombre de filleuls. */
export function computeReferralCredit(referralCount: number): number {
  return Math.min(Math.max(referralCount, 0) * REFERRAL_CREDIT_PER_SIGNUP, MAX_REFERRAL_CREDIT)
}

/** Nombre de filleuls restants avant d'atteindre le plafond de crédit. */
export function referralsToMaxCredit(referralCount: number): number {
  const maxReferrals = MAX_REFERRAL_CREDIT / REFERRAL_CREDIT_PER_SIGNUP // 10
  return Math.max(0, maxReferrals - Math.max(referralCount, 0))
}
