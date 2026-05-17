// Capture screenshots des pages clés en viewport mobile (iPhone 13 Pro)
// Scroll forcé pour déclencher les animations useInView avant le shot
import { chromium, devices } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.argv[2] ?? 'https://instant-rent.fr'
const OUT = './screenshots-mobile'

const PAGES = [
  { path: '/', name: '01-home' },
  { path: '/early-access', name: '02-early-access' },
  { path: '/early-access/proprietaire', name: '03-early-access-proprio' },
  { path: '/early-access/locataire', name: '04-early-access-locataire' },
  { path: '/aide', name: '05-aide' },
  { path: '/legal/bail-code-civil', name: '06-bail-code-civil' },
  { path: '/legal/cgu', name: '07-cgu' },
  { path: '/biens', name: '08-biens-blocked' },
  { path: '/login', name: '09-login' },
  { path: '/register', name: '10-register' },
]

async function scrollThroughPage(page) {
  // Scroll progressively to trigger all InView observers, then go back to top
  const total = await page.evaluate(() => document.body.scrollHeight)
  const step = 400
  let y = 0
  while (y < total) {
    await page.evaluate(p => window.scrollTo(0, p), y)
    await page.waitForTimeout(150)
    y += step
  }
  // Bottom
  await page.evaluate(p => window.scrollTo(0, p), total)
  await page.waitForTimeout(400)
  // Back to top
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
}

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  ...devices['iPhone 13 Pro'],
  locale: 'fr-FR',
})

await context.addInitScript(() => {
  try { localStorage.setItem('cookies_accepted', 'true') } catch {}
})

const page = await context.newPage()

for (const p of PAGES) {
  const url = BASE + p.path
  console.log(`Capturing ${url}...`)
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 })
    await page.waitForTimeout(500)
    await scrollThroughPage(page)
    await page.screenshot({
      path: `${OUT}/${p.name}.png`,
      fullPage: true,
    })
    console.log(`  ✓ ${p.name}.png`)
  } catch (err) {
    console.log(`  ✗ ${p.name}: ${err.message}`)
  }
}

await browser.close()
console.log(`\nDone. Screenshots in ${OUT}/`)
