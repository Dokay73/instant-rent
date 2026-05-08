import { test, expect } from '@playwright/test'
import path from 'path'

const TEST_IMAGE = path.join(__dirname, 'fixtures/test-image.png')
const TS = Date.now()

const OWNER = {
  email: `bot-candi-owner-${TS}@example.com`,
  password: 'BotTest1234!',
  fullName: 'Bot Owner',
}

const TENANT = {
  email: `bot-candi-tenant-${TS}@example.com`,
  password: 'BotTest1234!',
  fullName: 'Bot Tenant',
}

const PROPERTY_TITLE = `Bien test candidature ${TS}`

test.describe.configure({ mode: 'serial' })

test('Setup: Proprio publie un bien EN LIGNE', async ({ page }) => {
  test.setTimeout(180000)

  // Inscription proprio
  await page.goto('/register')
  await page.fill('input[type="text"]', OWNER.fullName)
  await page.fill('input[type="email"]', OWNER.email)
  await page.fill('input[type="password"]', OWNER.password)
  await page.check('input[type="checkbox"]')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/, { timeout: 15000 })

  // Wizard publication
  await page.goto('/dashboard/properties/new')

  // Étape 0
  await page.click('button:has-text("Studio")')
  await page.fill('input[placeholder*="rue"]', '5 avenue test')
  await page.fill('input[placeholder*="Paris"]', 'Lyon')
  await page.fill('input[placeholder="35"]', '30')
  await page.click('button:has-text("Suivant")')

  // Étape 1
  await page.fill('input[placeholder*="Appartement"]', PROPERTY_TITLE)
  await page.fill('textarea', 'Bien test pour candidature automatique.')
  await page.click('button:has-text("Suivant")')

  // Étape 2
  await page.click('button:has-text("Suivant")')

  // Étape 3
  await page.locator('button:has-text("Non")').first().click()
  await page.fill('input[placeholder="800"]', '700')
  await page.click('button:has-text("Suivant")')

  // Étape 4
  await page.click('button:has-text("Suivant")')

  // Étape 5 — Photos
  await page.locator('input[type="file"][accept*="image"]').setInputFiles([TEST_IMAGE, TEST_IMAGE, TEST_IMAGE, TEST_IMAGE])
  await page.waitForTimeout(1000)
  await page.click('button:has-text("Suivant")')

  // Étape 6 — Publication EN LIGNE
  await page.check('input[type="checkbox"]')
  await page.click('button:has-text("Publier maintenant")')

  await page.waitForURL(/\/dashboard/, { timeout: 30000 })
  await expect(page.getByText(PROPERTY_TITLE)).toBeVisible({ timeout: 10000 })
})

test('Locataire trouve le bien dans /biens', async ({ page }) => {
  // Inscription locataire
  await page.goto('/register')
  await page.fill('input[type="text"]', TENANT.fullName)
  await page.fill('input[type="email"]', TENANT.email)
  await page.fill('input[type="password"]', TENANT.password)
  await page.check('input[type="checkbox"]')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)

  // Aller sur /biens
  await page.goto('/biens')
  await expect(page.getByText(PROPERTY_TITLE).first()).toBeVisible({ timeout: 10000 })
})

test('Locataire ouvre la fiche bien et voit les boutons', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', TENANT.email)
  await page.fill('input[type="password"]', TENANT.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)

  await page.goto('/biens')
  await page.click(`text=${PROPERTY_TITLE}`)
  await page.waitForURL(/\/properties\//)
  await expect(page.getByRole('link', { name: /Déposer ma candidature/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Sauvegarder/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Contacter/ })).toBeVisible()
})

test('Locataire ajoute le bien aux favoris', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', TENANT.email)
  await page.fill('input[type="password"]', TENANT.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)

  await page.goto('/biens')
  await page.click(`text=${PROPERTY_TITLE}`)
  await page.waitForURL(/\/properties\//)

  // Sauvegarder
  await page.getByRole('button', { name: /Sauvegarder/ }).click()
  await expect(page.getByRole('button', { name: /Sauvegardé/ })).toBeVisible({ timeout: 5000 })

  // Vérifier dans /mes-favoris
  await page.goto('/mes-favoris')
  await expect(page.getByText(PROPERTY_TITLE)).toBeVisible()
})

test('Locataire contacte le propriétaire (création conversation)', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', TENANT.email)
  await page.fill('input[type="password"]', TENANT.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)

  await page.goto('/biens')
  await page.click(`text=${PROPERTY_TITLE}`)
  await page.waitForURL(/\/properties\//)

  await page.getByRole('button', { name: /Contacter le propriétaire/ }).click()
  await page.waitForURL(/\/messages\//, { timeout: 10000 })
  await expect(page.locator('input[placeholder*="message"]')).toBeVisible()
})

test('Locataire dépose une candidature avec docs', async ({ page }) => {
  test.setTimeout(60000)

  await page.goto('/login')
  await page.fill('input[type="email"]', TENANT.email)
  await page.fill('input[type="password"]', TENANT.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)

  await page.goto('/biens')
  await page.click(`text=${PROPERTY_TITLE}`)
  await page.waitForURL(/\/properties\//)
  await page.getByRole('link', { name: /Déposer ma candidature/ }).click()

  // Sélectionner durée
  await page.click('button:has-text("3 mois")')

  // Message
  await page.fill('textarea', 'Candidature automatique de test.')

  // Upload des 3 docs
  const fileInputs = await page.locator('input[type="file"]').all()
  for (const input of fileInputs) {
    await input.setInputFiles(TEST_IMAGE)
  }
  await page.waitForTimeout(1000)

  await page.click('button:has-text("Envoyer ma candidature"), button[type="submit"]')
  await page.waitForURL(/\/success/, { timeout: 30000 })
  await expect(page.getByText(/candidature/i)).toBeVisible()
})

test('Proprio voit la candidature dans son dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', OWNER.email)
  await page.fill('input[type="password"]', OWNER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)

  // Cliquer sur "1 dossier"
  await page.click('a:has-text("dossier")')
  await page.waitForURL(/\/applications/)
  await expect(page.getByText(TENANT.fullName)).toBeVisible({ timeout: 10000 })
})
