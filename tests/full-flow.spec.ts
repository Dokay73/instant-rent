import { test, expect } from '@playwright/test'
import path from 'path'

const TEST_IMAGE = path.join(__dirname, 'fixtures/test-image.png')
const TIMESTAMP = Date.now()

const OWNER = {
  email: `bot-owner-${TIMESTAMP}@example.com`,
  password: 'BotTest1234!',
  fullName: 'Bot Proprio Test',
}

const TENANT = {
  email: `bot-tenant-${TIMESTAMP}@example.com`,
  password: 'BotTest1234!',
  fullName: 'Bot Locataire Test',
}

test.describe.configure({ mode: 'serial' })

test('1. Inscription propriétaire', async ({ page }) => {
  await page.goto('/register')
  await page.fill('input[placeholder*="Jean"], input[name="fullName"], input[type="text"]:nth-of-type(1)', OWNER.fullName)
  await page.fill('input[type="email"]', OWNER.email)
  await page.fill('input[type="password"]', OWNER.password)
  await page.check('input[type="checkbox"]')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard|\/login/, { timeout: 15000 })
})

test('2. Inscription locataire', async ({ page }) => {
  await page.goto('/register')
  await page.fill('input[type="text"]', TENANT.fullName)
  await page.fill('input[type="email"]', TENANT.email)
  await page.fill('input[type="password"]', TENANT.password)
  await page.check('input[type="checkbox"]')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard|\/login/, { timeout: 15000 })
})

test('3. Connexion propriétaire et accès dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', OWNER.email)
  await page.fill('input[type="password"]', OWNER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/, { timeout: 15000 })
  await expect(page.getByText('Tableau de bord')).toBeVisible()
})

test('4. Onboarding visible sur dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', OWNER.email)
  await page.fill('input[type="password"]', OWNER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)
  await expect(page.getByText('Bienvenue sur Instant Rent')).toBeVisible()
  await expect(page.getByText('Pour bien démarrer')).toBeVisible()
})

test('5. Wizard de publication accessible', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', OWNER.email)
  await page.fill('input[type="password"]', OWNER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)
  await page.click('a:has-text("Ajouter")')
  await page.waitForURL(/\/dashboard\/properties\/new/, { timeout: 10000 })
  await expect(page.getByText('Localisation').first()).toBeVisible()
})

test('6. Page /biens accessible et liste les biens', async ({ page }) => {
  await page.goto('/biens')
  await expect(page).toHaveURL(/\/biens/)
})

test('7. Lien Discord présent dans le footer', async ({ page }) => {
  await page.goto('/')
  const discordLink = page.locator('a[href*="discord.gg"]').first()
  await expect(discordLink).toBeVisible()
  await expect(discordLink).toHaveAttribute('href', /discord\.gg/)
})

test('8. Bandeau accès anticipé redirige vers /early-access', async ({ page }) => {
  await page.goto('/')
  await page.click('a:has-text("Accès anticipé ouvert")')
  await page.waitForURL(/\/early-access/, { timeout: 10000 })
  await expect(page.getByText('Lancez votre bien en location')).toBeVisible()
})
