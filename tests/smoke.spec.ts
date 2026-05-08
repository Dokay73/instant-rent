import { test, expect } from '@playwright/test'

test.describe('Smoke tests — pages publiques', () => {
  test('Page d\'accueil se charge avec le bandeau accès anticipé', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Accès anticipé ouvert').first()).toBeVisible()
    await expect(page.locator('header').first()).toBeVisible()
  })

  test('Page /biens se charge', async ({ page }) => {
    await page.goto('/biens')
    await expect(page).toHaveURL(/\/biens/)
  })

  test('Page /early-access se charge avec le formulaire', async ({ page }) => {
    await page.goto('/early-access')
    await expect(page.locator('text=Lancez votre bien en location')).toBeVisible()
    await expect(page.locator('input[type=email]')).toBeVisible()
    await expect(page.locator('button:has-text("Rejoindre la liste")')).toBeVisible()
  })

  test('Page /login se charge', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type=email]')).toBeVisible()
    await expect(page.locator('input[type=password]')).toBeVisible()
  })

  test('Page /register se charge avec checkbox CGU', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('input[type=email]')).toBeVisible()
    await expect(page.locator('input[type=checkbox]')).toBeVisible()
    await expect(page.locator('text=conditions générales')).toBeVisible()
  })

  test('Pages légales se chargent', async ({ page }) => {
    await page.goto('/legal/mentions-legales')
    await expect(page.getByRole('heading', { name: 'Mentions légales' })).toBeVisible()
    await expect(page.getByText('Hakan Gunduz').first()).toBeVisible()

    await page.goto('/legal/cgu')
    await expect(page.getByRole('heading', { name: /Conditions Générales/ })).toBeVisible()

    await page.goto('/legal/confidentialite')
    await expect(page.getByRole('heading', { name: 'Politique de confidentialité' })).toBeVisible()
  })

  test('Routes protégées redirigent vers /login si non connecté', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)

    await page.goto('/profil')
    await expect(page).toHaveURL(/\/login/)

    await page.goto('/messages')
    await expect(page).toHaveURL(/\/login/)
  })

  test('Inscription sur la waitlist fonctionne', async ({ page }) => {
    await page.goto('/early-access')
    const uniqueEmail = `test-${Date.now()}@example.com`
    await page.fill('input[placeholder="Jean Dupont"]', 'Test Bot')
    await page.fill('input[type=email]', uniqueEmail)
    await page.fill('input[placeholder="Paris"]', 'Lyon')
    await page.click('button:has-text("Rejoindre la liste")')
    await expect(page.locator('text=Inscription confirmée')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Rejoindre le Discord')).toBeVisible()
  })
})
