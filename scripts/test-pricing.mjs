// Test pur du moteur de facturation. Aucune dépendance externe.
// Lancement : node scripts/test-pricing.mjs
// (mirroir JS de lib/pricing.ts — on teste la LOGIQUE, pas l'import TS.)

const FEE_LOW_CENTS = 29000, FEE_MID_CENTS = 39000, FEE_HIGH_CENTS = 49000
const TIER_LOW_MAX = 1200, TIER_MID_MAX = 2200
const PIONEER_FIRST_CENTS = 0, PIONEER_NEXT_CENTS = 19900
const FEE_BASIS = 'hc'

function standardTier(rentEuros) {
  if (rentEuros < TIER_LOW_MAX) return { amountCents: FEE_LOW_CENTS, tier: '290' }
  if (rentEuros <= TIER_MID_MAX) return { amountCents: FEE_MID_CENTS, tier: '390' }
  return { amountCents: FEE_HIGH_CENTS, tier: '490' }
}
function computeServiceFee({ rentHc, charges = 0, isPioneer, priorPlacementCount }) {
  if (isPioneer) {
    if (priorPlacementCount <= 0) return { amountCents: PIONEER_FIRST_CENTS, tier: 'pioneer_first' }
    return { amountCents: PIONEER_NEXT_CENTS, tier: 'pioneer_next' }
  }
  const rentEuros = FEE_BASIS === 'cc' ? rentHc + charges : rentHc
  return standardTier(rentEuros)
}

let pass = 0, fail = 0
function eq(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (ok) { pass++; console.log(`  ✓ ${name}`) }
  else { fail++; console.log(`  ✗ ${name}\n     attendu ${JSON.stringify(want)}\n     obtenu  ${JSON.stringify(got)}`) }
}

console.log('— Paliers standard (frontières) —')
eq('loyer 0 → 290',        standardTier(0),    { amountCents: 29000, tier: '290' })
eq('loyer 1199 → 290',     standardTier(1199), { amountCents: 29000, tier: '290' })
eq('loyer 1200 (borne) → 390', standardTier(1200), { amountCents: 39000, tier: '390' })
eq('loyer 1800 → 390',     standardTier(1800), { amountCents: 39000, tier: '390' })
eq('loyer 2200 (borne) → 390', standardTier(2200), { amountCents: 39000, tier: '390' })
eq('loyer 2201 → 490',     standardTier(2201), { amountCents: 49000, tier: '490' })
eq('loyer 5000 → 490',     standardTier(5000), { amountCents: 49000, tier: '490' })

console.log('— computeServiceFee : non-pionnier (base HC, charges ignorées) —')
eq('900 HC + 300 charges → 290 (HC seul)', computeServiceFee({ rentHc: 900, charges: 300, isPioneer: false, priorPlacementCount: 0 }), { amountCents: 29000, tier: '290' })
eq('1300 HC → 390',        computeServiceFee({ rentHc: 1300, isPioneer: false, priorPlacementCount: 3 }), { amountCents: 39000, tier: '390' })
eq('2500 HC → 490',        computeServiceFee({ rentHc: 2500, isPioneer: false, priorPlacementCount: 0 }), { amountCents: 49000, tier: '490' })

console.log('— computeServiceFee : pionnier —')
eq('pionnier 1er placement → 0 €', computeServiceFee({ rentHc: 2500, isPioneer: true, priorPlacementCount: 0 }), { amountCents: 0, tier: 'pioneer_first' })
eq('pionnier 2e placement → 199 €', computeServiceFee({ rentHc: 900, isPioneer: true, priorPlacementCount: 1 }), { amountCents: 19900, tier: 'pioneer_next' })
eq('pionnier 5e placement → 199 €', computeServiceFee({ rentHc: 5000, isPioneer: true, priorPlacementCount: 4 }), { amountCents: 19900, tier: 'pioneer_next' })

console.log(`\n${fail === 0 ? '✅' : '❌'} ${pass} passés, ${fail} échoués`)
process.exit(fail === 0 ? 0 : 1)
