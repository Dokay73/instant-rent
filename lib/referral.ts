const REFERRAL_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // exclut O, 0, I, 1 pour éviter confusion
const REFERRAL_LENGTH = 6

export function generateReferralCode(): string {
  let code = ''
  for (let i = 0; i < REFERRAL_LENGTH; i++) {
    code += REFERRAL_CHARS[Math.floor(Math.random() * REFERRAL_CHARS.length)]
  }
  return code
}

export const BASE_PROMO_MONTHS = 2
export const PROMO_PER_REFERRAL_MONTHS = 1
export const MAX_PROMO_MONTHS = 12

export function computePromoMonths(referralCount: number): number {
  return Math.min(BASE_PROMO_MONTHS + referralCount * PROMO_PER_REFERRAL_MONTHS, MAX_PROMO_MONTHS)
}

export function monthsToDays(months: number): number {
  return months * 30
}

export function nextMilestoneAfter(referralCount: number): { referralsLeft: number; monthsAtMilestone: number } | null {
  if (referralCount >= MAX_PROMO_MONTHS - BASE_PROMO_MONTHS) return null
  // Next milestone = next integer above current
  const next = referralCount + 1
  return {
    referralsLeft: 1,
    monthsAtMilestone: computePromoMonths(next),
  }
}
