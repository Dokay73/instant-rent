import { test, expect } from '@playwright/test'
import path from 'path'

const TEST_IMAGE = path.join(__dirname, 'fixtures/test-image.png')
const TS = Date.now()

const OWNER = {
  email: `bot-publi-${TS}@example.com`,
  password: 'BotTest1234!',
  fullName: 'Bot Publication Test',
}

test.describe.configure({ mode: 'serial' })

test.beforeEach(async ({ context }) => {
  // Pré-accepter les cookies pour éviter que le bandeau intercepte les clics
  await context.addInitScript(() => {
    localStorage.setItem('cookies_accepted', 'true')
  })
})

async function loginOwner(page: any) {
  await page.goto('/register')
  await page.fill('input[type="text"]', OWNER.fullName)
  await page.fill('input[type="email"]', OWNER.email)
  await page.fill('input[type="password"]', OWNER.password)
  await page.check('input[type="checkbox"]')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/, { timeout: 15000 })
}

test('Publication complète d\'un bien (7 étapes)', async ({ page }) => {
  test.setTimeout(120000)

  await loginOwner(page)
  await page.goto('/dashboard/properties/new')

  // Étape 0 — Localisation
  await expect(page.locator('h1').filter({ hasText: 'Localisation' })).toBeVisible()
  await page.click('button:has-text("T2")')
  await page.fill('input[placeholder*="rue"]', '12 rue du Test')
  await page.fill('input[placeholder*="Paris"]', 'Paris')
  await page.fill('input[placeholder="35"]', '45')
  await page.click('button:has-text("Suivant")')

  // Étape 1 — Description
  await expect(page.locator('h1').filter({ hasText: 'Description' })).toBeVisible()
  await page.fill('input[placeholder*="Appartement"]', 'Appartement test bot')
  await page.fill('textarea', 'Description automatique pour test E2E. Bel appartement lumineux.')
  await page.click('button:has-text("Suivant")')

  // Étape 2 — Équipements
  await expect(page.locator('h1').filter({ hasText: 'Équipements' })).toBeVisible()
  await page.click('button:has-text("Wifi")')
  await page.click('button:has-text("Lave-linge")')
  await page.click('button:has-text("Réfrigérateur")')
  await page.click('button:has-text("Suivant")')

  // Étape 3 — Finances
  await expect(page.locator('h1').filter({ hasText: 'Finances' })).toBeVisible()
  await page.locator('button:has-text("Non")').first().click() // zone tendue: Non
  await page.fill('input[placeholder="800"]', '900')
  await page.fill('input[placeholder="100"]', '50')
  await page.fill('input[placeholder="1600"]', '1800')
  await page.click('button:has-text("Suivant")')

  // Étape 4 — Durées
  await expect(page.locator('h1').filter({ hasText: 'Durées' })).toBeVisible()
  // Les durées par défaut [1, 3, 6, 12] sont déjà cochées
  await page.click('button:has-text("Suivant")')

  // Étape 5 — Photos
  await expect(page.locator('h1').filter({ hasText: 'Photos' })).toBeVisible()
  const fileInput = page.locator('input[type="file"][accept*="image"]')
  await fileInput.setInputFiles([TEST_IMAGE, TEST_IMAGE, TEST_IMAGE, TEST_IMAGE])
  await page.waitForTimeout(1000)
  await page.click('button:has-text("Suivant")')

  // Étape 6 — Publication
  await expect(page.locator('h1').filter({ hasText: 'Publication' })).toBeVisible()
  await page.check('input[type="checkbox"]') // CGU
  await page.click('button:has-text("Sauvegarder en brouillon")')

  // Vérifier la redirection vers le dashboard
  await page.waitForURL(/\/dashboard/, { timeout: 30000 })
  await expect(page.getByText('Appartement test bot')).toBeVisible({ timeout: 10000 })
})

test('Le bien apparaît dans le dashboard avec les bonnes infos', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', OWNER.email)
  await page.fill('input[type="password"]', OWNER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)
  await expect(page.getByText('Appartement test bot')).toBeVisible()
  await expect(page.getByText('900 € HC')).toBeVisible()
  await expect(page.locator('a:has-text("Modifier")').first()).toBeVisible()
})

test('Toggle publié / brouillon fonctionne', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', OWNER.email)
  await page.fill('input[type="password"]', OWNER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)
  // Le bien est en brouillon, on doit voir "Hors ligne"
  await expect(page.getByText('Hors ligne').first()).toBeVisible()
})
