import { test, expect } from '@playwright/test'

const TS = Date.now()
const USER = {
  email: `bot-profil-${TS}@example.com`,
  password: 'BotTest1234!',
  fullName: 'Bot Profil Test',
}

test.describe.configure({ mode: 'serial' })

async function signupAndLogin(page: any) {
  await page.goto('/register')
  await page.fill('input[type="text"]', USER.fullName)
  await page.fill('input[type="email"]', USER.email)
  await page.fill('input[type="password"]', USER.password)
  await page.check('input[type="checkbox"]')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/, { timeout: 15000 })
}

test('1. Profil — édition des infos générales', async ({ page }) => {
  await signupAndLogin(page)
  await page.goto('/profil')

  await page.fill('input[placeholder*="Jean Dupont"]', 'Bot Modifié')
  await page.fill('input[type="tel"]', '0612345678')
  await page.click('button[type="submit"]:has-text("Enregistrer")')
  await expect(page.getByText('Profil mis à jour')).toBeVisible({ timeout: 10000 })
})

test('2. Profil — page mot de passe accessible', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', USER.email)
  await page.fill('input[type="password"]', USER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)

  await page.goto('/profil/mot-de-passe')
  await expect(page.locator('input[type="password"]').first()).toBeVisible()
})

test('3. Profil — page notifications accessible', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', USER.email)
  await page.fill('input[type="password"]', USER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)

  await page.goto('/profil/notifications')
  await expect(page.locator('h1, h2').first()).toBeVisible()
})

test('4. Profil — page vérification accessible', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', USER.email)
  await page.fill('input[type="password"]', USER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)

  await page.goto('/profil/verification')
  await expect(page.getByText(/email|identité|téléphone/i).first()).toBeVisible()
})

test('5. Profil — page suppression compte avec confirmation', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', USER.email)
  await page.fill('input[type="password"]', USER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)

  await page.goto('/profil/supprimer-compte')
  await expect(page.getByText(/Supprimer mon compte/i).first()).toBeVisible()
  await expect(page.locator('input[placeholder*="SUPPRIMER"]')).toBeVisible()

  // Bouton désactivé tant que le texte n'est pas tapé correctement
  const deleteBtn = page.getByRole('button', { name: /Supprimer définitivement/ })
  await expect(deleteBtn).toBeDisabled()

  // Tape mauvais texte
  await page.fill('input[placeholder*="SUPPRIMER"]', 'OUI')
  await expect(deleteBtn).toBeDisabled()

  // Tape bon texte
  await page.fill('input[placeholder*="SUPPRIMER"]', 'SUPPRIMER MON COMPTE')
  await expect(deleteBtn).toBeEnabled()
  // On ne clique PAS pour ne pas supprimer le compte test
})

test('6. Logout fonctionne', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', USER.email)
  await page.fill('input[type="password"]', USER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)

  // Ouvrir le dropdown
  await page.locator('header button').last().click()
  await page.click('button:has-text("Déconnexion")')
  await page.waitForURL(/\/$|\/login/, { timeout: 10000 })
})
