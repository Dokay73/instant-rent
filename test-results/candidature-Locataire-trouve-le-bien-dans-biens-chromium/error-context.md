# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: candidature.spec.ts >> Locataire trouve le bien dans /biens
- Location: tests\candidature.spec.ts:74:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Bien test candidature 1778238266698').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('Bien test candidature 1778238266698').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "Instant Rent" [ref=e5] [cursor=pointer]:
          - /url: /
        - navigation [ref=e6]:
          - link "Biens disponibles" [ref=e7] [cursor=pointer]:
            - /url: /biens
          - button "BT Bot" [ref=e9]:
            - generic [ref=e10]: BT
            - generic [ref=e11]: Bot
            - img [ref=e12]
    - generic [ref=e16]:
      - generic [ref=e17]:
        - paragraph [ref=e18]: Annonces
        - heading "Biens disponibles" [level=1] [ref=e19]
        - paragraph [ref=e20]: 5 biens disponibles
      - generic [ref=e21]:
        - textbox "Filtrer par ville..." [ref=e22]
        - button "Filtrer" [ref=e23]
    - generic [ref=e25]:
      - link "5 avenue test 1 – 12 mois 5 avenue test Lyon 700 € CC/mois Caution 0 € Bail Code Civil Voir le bien →" [ref=e26] [cursor=pointer]:
        - /url: /properties/c7393c26-4e2d-46a4-ab68-4b754c665706
        - generic [ref=e27]:
          - generic [ref=e28]:
            - img "5 avenue test" [ref=e29]
            - generic [ref=e31]: 1 – 12 mois
          - generic [ref=e32]:
            - paragraph [ref=e33]: 5 avenue test
            - paragraph [ref=e34]: Lyon
            - generic [ref=e35]:
              - generic [ref=e37]:
                - generic [ref=e38]: "700"
                - generic [ref=e39]: € CC/mois
              - generic [ref=e40]:
                - paragraph [ref=e41]: Caution
                - paragraph [ref=e42]: 0 €
            - generic [ref=e43]:
              - generic [ref=e44]: Bail Code Civil
              - generic [ref=e45]: Voir le bien →
      - link "80 Rue de la reine 6 – 18 mois 80 Rue de la reine Paris 1000 € CC/mois dont 100 € de charges Caution 1499 € Bail Code Civil Voir le bien →" [ref=e46] [cursor=pointer]:
        - /url: /properties/93103448-6475-4308-8569-1e0eef5add3c
        - generic [ref=e47]:
          - generic [ref=e48]:
            - img "80 Rue de la reine" [ref=e49]
            - generic [ref=e51]: 6 – 18 mois
          - generic [ref=e52]:
            - paragraph [ref=e53]: 80 Rue de la reine
            - paragraph [ref=e54]: Paris
            - generic [ref=e55]:
              - generic [ref=e56]:
                - generic [ref=e57]:
                  - generic [ref=e58]: "1000"
                  - generic [ref=e59]: € CC/mois
                - paragraph [ref=e60]: dont 100 € de charges
              - generic [ref=e61]:
                - paragraph [ref=e62]: Caution
                - paragraph [ref=e63]: 1499 €
            - generic [ref=e64]:
              - generic [ref=e65]: Bail Code Civil
              - generic [ref=e66]: Voir le bien →
      - link "1 – 12 mois 26 route de grignon Albertville 1322 € CC/mois dont 122 € de charges Caution 1200 € Bail Code Civil Voir le bien →" [ref=e67] [cursor=pointer]:
        - /url: /properties/3a7639d2-6633-45f6-b610-e20e953eb967
        - generic [ref=e68]:
          - generic [ref=e69]:
            - img [ref=e71]
            - generic [ref=e75]: 1 – 12 mois
          - generic [ref=e76]:
            - paragraph [ref=e77]: 26 route de grignon
            - paragraph [ref=e78]: Albertville
            - generic [ref=e79]:
              - generic [ref=e80]:
                - generic [ref=e81]:
                  - generic [ref=e82]: "1322"
                  - generic [ref=e83]: € CC/mois
                - paragraph [ref=e84]: dont 122 € de charges
              - generic [ref=e85]:
                - paragraph [ref=e86]: Caution
                - paragraph [ref=e87]: 1200 €
            - generic [ref=e88]:
              - generic [ref=e89]: Bail Code Civil
              - generic [ref=e90]: Voir le bien →
      - link "1 – 12 mois 13 rue georges lamarque Albertville 800 € CC/mois Caution 800 € Bail Code Civil Voir le bien →" [ref=e91] [cursor=pointer]:
        - /url: /properties/1f7f5c53-2e81-4737-b899-160a7af20f2b
        - generic [ref=e92]:
          - generic [ref=e93]:
            - img [ref=e95]
            - generic [ref=e99]: 1 – 12 mois
          - generic [ref=e100]:
            - paragraph [ref=e101]: 13 rue georges lamarque
            - paragraph [ref=e102]: Albertville
            - generic [ref=e103]:
              - generic [ref=e105]:
                - generic [ref=e106]: "800"
                - generic [ref=e107]: € CC/mois
              - generic [ref=e108]:
                - paragraph [ref=e109]: Caution
                - paragraph [ref=e110]: 800 €
            - generic [ref=e111]:
              - generic [ref=e112]: Bail Code Civil
              - generic [ref=e113]: Voir le bien →
      - link "2 – 12 mois 91 rue de la sablière Paris 1000 € CC/mois dont 100 € de charges Caution 1000 € Bail Code Civil Voir le bien →" [ref=e114] [cursor=pointer]:
        - /url: /properties/0bcd0966-dc4e-4abc-9f81-5efa6f94c576
        - generic [ref=e115]:
          - generic [ref=e116]:
            - img [ref=e118]
            - generic [ref=e122]: 2 – 12 mois
          - generic [ref=e123]:
            - paragraph [ref=e124]: 91 rue de la sablière
            - paragraph [ref=e125]: Paris
            - generic [ref=e126]:
              - generic [ref=e127]:
                - generic [ref=e128]:
                  - generic [ref=e129]: "1000"
                  - generic [ref=e130]: € CC/mois
                - paragraph [ref=e131]: dont 100 € de charges
              - generic [ref=e132]:
                - paragraph [ref=e133]: Caution
                - paragraph [ref=e134]: 1000 €
            - generic [ref=e135]:
              - generic [ref=e136]: Bail Code Civil
              - generic [ref=e137]: Voir le bien →
  - alert [ref=e138]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | import path from 'path'
  3   | 
  4   | const TEST_IMAGE = path.join(__dirname, 'fixtures/test-image.png')
  5   | const TS = Date.now()
  6   | 
  7   | const OWNER = {
  8   |   email: `bot-candi-owner-${TS}@example.com`,
  9   |   password: 'BotTest1234!',
  10  |   fullName: 'Bot Owner',
  11  | }
  12  | 
  13  | const TENANT = {
  14  |   email: `bot-candi-tenant-${TS}@example.com`,
  15  |   password: 'BotTest1234!',
  16  |   fullName: 'Bot Tenant',
  17  | }
  18  | 
  19  | const PROPERTY_TITLE = `Bien test candidature ${TS}`
  20  | 
  21  | test.describe.configure({ mode: 'serial' })
  22  | 
  23  | test('Setup: Proprio publie un bien EN LIGNE', async ({ page }) => {
  24  |   test.setTimeout(180000)
  25  | 
  26  |   // Inscription proprio
  27  |   await page.goto('/register')
  28  |   await page.fill('input[type="text"]', OWNER.fullName)
  29  |   await page.fill('input[type="email"]', OWNER.email)
  30  |   await page.fill('input[type="password"]', OWNER.password)
  31  |   await page.check('input[type="checkbox"]')
  32  |   await page.click('button[type="submit"]')
  33  |   await page.waitForURL(/\/dashboard/, { timeout: 15000 })
  34  | 
  35  |   // Wizard publication
  36  |   await page.goto('/dashboard/properties/new')
  37  | 
  38  |   // Étape 0
  39  |   await page.click('button:has-text("Studio")')
  40  |   await page.fill('input[placeholder*="rue"]', '5 avenue test')
  41  |   await page.fill('input[placeholder*="Paris"]', 'Lyon')
  42  |   await page.fill('input[placeholder="35"]', '30')
  43  |   await page.click('button:has-text("Suivant")')
  44  | 
  45  |   // Étape 1
  46  |   await page.fill('input[placeholder*="Appartement"]', PROPERTY_TITLE)
  47  |   await page.fill('textarea', 'Bien test pour candidature automatique.')
  48  |   await page.click('button:has-text("Suivant")')
  49  | 
  50  |   // Étape 2
  51  |   await page.click('button:has-text("Suivant")')
  52  | 
  53  |   // Étape 3
  54  |   await page.locator('button:has-text("Non")').first().click()
  55  |   await page.fill('input[placeholder="800"]', '700')
  56  |   await page.click('button:has-text("Suivant")')
  57  | 
  58  |   // Étape 4
  59  |   await page.click('button:has-text("Suivant")')
  60  | 
  61  |   // Étape 5 — Photos
  62  |   await page.locator('input[type="file"][accept*="image"]').setInputFiles([TEST_IMAGE, TEST_IMAGE, TEST_IMAGE, TEST_IMAGE])
  63  |   await page.waitForTimeout(1000)
  64  |   await page.click('button:has-text("Suivant")')
  65  | 
  66  |   // Étape 6 — Publication EN LIGNE
  67  |   await page.check('input[type="checkbox"]')
  68  |   await page.click('button:has-text("Publier maintenant")')
  69  | 
  70  |   await page.waitForURL(/\/dashboard/, { timeout: 30000 })
  71  |   await expect(page.getByText(PROPERTY_TITLE)).toBeVisible({ timeout: 10000 })
  72  | })
  73  | 
  74  | test('Locataire trouve le bien dans /biens', async ({ page }) => {
  75  |   // Inscription locataire
  76  |   await page.goto('/register')
  77  |   await page.fill('input[type="text"]', TENANT.fullName)
  78  |   await page.fill('input[type="email"]', TENANT.email)
  79  |   await page.fill('input[type="password"]', TENANT.password)
  80  |   await page.check('input[type="checkbox"]')
  81  |   await page.click('button[type="submit"]')
  82  |   await page.waitForURL(/\/dashboard/)
  83  | 
  84  |   // Aller sur /biens
  85  |   await page.goto('/biens')
> 86  |   await expect(page.getByText(PROPERTY_TITLE).first()).toBeVisible({ timeout: 10000 })
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  87  | })
  88  | 
  89  | test('Locataire ouvre la fiche bien et voit les boutons', async ({ page }) => {
  90  |   await page.goto('/login')
  91  |   await page.fill('input[type="email"]', TENANT.email)
  92  |   await page.fill('input[type="password"]', TENANT.password)
  93  |   await page.click('button[type="submit"]')
  94  |   await page.waitForURL(/\/dashboard/)
  95  | 
  96  |   await page.goto('/biens')
  97  |   await page.click(`text=${PROPERTY_TITLE}`)
  98  |   await page.waitForURL(/\/properties\//)
  99  |   await expect(page.getByRole('link', { name: /Déposer ma candidature/ })).toBeVisible()
  100 |   await expect(page.getByRole('button', { name: /Sauvegarder/ })).toBeVisible()
  101 |   await expect(page.getByRole('button', { name: /Contacter/ })).toBeVisible()
  102 | })
  103 | 
  104 | test('Locataire ajoute le bien aux favoris', async ({ page }) => {
  105 |   await page.goto('/login')
  106 |   await page.fill('input[type="email"]', TENANT.email)
  107 |   await page.fill('input[type="password"]', TENANT.password)
  108 |   await page.click('button[type="submit"]')
  109 |   await page.waitForURL(/\/dashboard/)
  110 | 
  111 |   await page.goto('/biens')
  112 |   await page.click(`text=${PROPERTY_TITLE}`)
  113 |   await page.waitForURL(/\/properties\//)
  114 | 
  115 |   // Sauvegarder
  116 |   await page.getByRole('button', { name: /Sauvegarder/ }).click()
  117 |   await expect(page.getByRole('button', { name: /Sauvegardé/ })).toBeVisible({ timeout: 5000 })
  118 | 
  119 |   // Vérifier dans /mes-favoris
  120 |   await page.goto('/mes-favoris')
  121 |   await expect(page.getByText(PROPERTY_TITLE)).toBeVisible()
  122 | })
  123 | 
  124 | test('Locataire contacte le propriétaire (création conversation)', async ({ page }) => {
  125 |   await page.goto('/login')
  126 |   await page.fill('input[type="email"]', TENANT.email)
  127 |   await page.fill('input[type="password"]', TENANT.password)
  128 |   await page.click('button[type="submit"]')
  129 |   await page.waitForURL(/\/dashboard/)
  130 | 
  131 |   await page.goto('/biens')
  132 |   await page.click(`text=${PROPERTY_TITLE}`)
  133 |   await page.waitForURL(/\/properties\//)
  134 | 
  135 |   await page.getByRole('button', { name: /Contacter le propriétaire/ }).click()
  136 |   await page.waitForURL(/\/messages\//, { timeout: 10000 })
  137 |   await expect(page.locator('input[placeholder*="message"]')).toBeVisible()
  138 | })
  139 | 
  140 | test('Locataire dépose une candidature avec docs', async ({ page }) => {
  141 |   test.setTimeout(60000)
  142 | 
  143 |   await page.goto('/login')
  144 |   await page.fill('input[type="email"]', TENANT.email)
  145 |   await page.fill('input[type="password"]', TENANT.password)
  146 |   await page.click('button[type="submit"]')
  147 |   await page.waitForURL(/\/dashboard/)
  148 | 
  149 |   await page.goto('/biens')
  150 |   await page.click(`text=${PROPERTY_TITLE}`)
  151 |   await page.waitForURL(/\/properties\//)
  152 |   await page.getByRole('link', { name: /Déposer ma candidature/ }).click()
  153 | 
  154 |   // Sélectionner durée
  155 |   await page.click('button:has-text("3 mois")')
  156 | 
  157 |   // Message
  158 |   await page.fill('textarea', 'Candidature automatique de test.')
  159 | 
  160 |   // Upload des 3 docs
  161 |   const fileInputs = await page.locator('input[type="file"]').all()
  162 |   for (const input of fileInputs) {
  163 |     await input.setInputFiles(TEST_IMAGE)
  164 |   }
  165 |   await page.waitForTimeout(1000)
  166 | 
  167 |   await page.click('button:has-text("Envoyer ma candidature"), button[type="submit"]')
  168 |   await page.waitForURL(/\/success/, { timeout: 30000 })
  169 |   await expect(page.getByText(/candidature/i)).toBeVisible()
  170 | })
  171 | 
  172 | test('Proprio voit la candidature dans son dashboard', async ({ page }) => {
  173 |   await page.goto('/login')
  174 |   await page.fill('input[type="email"]', OWNER.email)
  175 |   await page.fill('input[type="password"]', OWNER.password)
  176 |   await page.click('button[type="submit"]')
  177 |   await page.waitForURL(/\/dashboard/)
  178 | 
  179 |   // Cliquer sur "1 dossier"
  180 |   await page.click('a:has-text("dossier")')
  181 |   await page.waitForURL(/\/applications/)
  182 |   await expect(page.getByText(TENANT.fullName)).toBeVisible({ timeout: 10000 })
  183 | })
  184 | 
```