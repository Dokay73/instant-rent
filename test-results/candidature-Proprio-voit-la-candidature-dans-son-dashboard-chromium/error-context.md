# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: candidature.spec.ts >> Proprio voit la candidature dans son dashboard
- Location: tests\candidature.spec.ts:177:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Bot Tenant')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('Bot Tenant')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - link "Instant Rent" [ref=e6] [cursor=pointer]:
          - /url: /
        - navigation [ref=e7]:
          - link "Biens disponibles" [ref=e8] [cursor=pointer]:
            - /url: /biens
          - button "BO Bot" [ref=e10]:
            - generic [ref=e11]: BO
            - generic [ref=e12]: Bot
            - img [ref=e13]
    - generic [ref=e15]:
      - link "Retour au tableau de bord" [ref=e16] [cursor=pointer]:
        - /url: /dashboard
        - img [ref=e17]
        - text: Retour au tableau de bord
      - generic [ref=e19]:
        - generic [ref=e20]:
          - paragraph [ref=e21]: Candidatures reçues
          - heading "1778239472254 rue test bot" [level=1] [ref=e22]
          - paragraph [ref=e23]: Lyon
        - generic [ref=e24]:
          - paragraph [ref=e25]: "1"
          - paragraph [ref=e26]: dossier
      - generic [ref=e28]:
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: "?"
            - generic [ref=e32]:
              - paragraph
              - paragraph [ref=e33]:
                - text: "Durée souhaitée :"
                - generic [ref=e34]: 3 mois
          - generic [ref=e35]: En attente
        - paragraph [ref=e37]: "\"Candidature automatique de test.\""
        - generic [ref=e38]:
          - link "Pièce d'identité ↗" [ref=e39] [cursor=pointer]:
            - /url: "#"
          - link "Contrat de travail ↗" [ref=e40] [cursor=pointer]:
            - /url: "#"
          - link "Justif. domicile ↗" [ref=e41] [cursor=pointer]:
            - /url: "#"
        - generic [ref=e43]:
          - button "Valider & Souscrire" [ref=e44]
          - button "Refuser" [ref=e45]
```

# Test source

```ts
  87  | 
  88  |   // Aller sur /biens (reload pour bypass cache)
  89  |   await page.goto('/biens')
  90  |   await page.reload()
  91  |   await expect(page.getByText(PROPERTY_ADDRESS).first()).toBeVisible({ timeout: 15000 })
  92  | })
  93  | 
  94  | test('Locataire ouvre la fiche bien et voit les boutons', async ({ page }) => {
  95  |   await page.goto('/login')
  96  |   await page.fill('input[type="email"]', TENANT.email)
  97  |   await page.fill('input[type="password"]', TENANT.password)
  98  |   await page.click('button[type="submit"]')
  99  |   await page.waitForURL(/\/dashboard/)
  100 | 
  101 |   await page.goto('/biens')
  102 |   await page.click(`text=${PROPERTY_ADDRESS}`)
  103 |   await page.waitForURL(/\/properties\//)
  104 |   await expect(page.getByRole('link', { name: /Déposer ma candidature/ })).toBeVisible()
  105 |   await expect(page.getByRole('button', { name: /Sauvegarder/ })).toBeVisible()
  106 |   await expect(page.getByRole('button', { name: /Contacter/ })).toBeVisible()
  107 | })
  108 | 
  109 | test('Locataire ajoute le bien aux favoris', async ({ page }) => {
  110 |   await page.goto('/login')
  111 |   await page.fill('input[type="email"]', TENANT.email)
  112 |   await page.fill('input[type="password"]', TENANT.password)
  113 |   await page.click('button[type="submit"]')
  114 |   await page.waitForURL(/\/dashboard/)
  115 | 
  116 |   await page.goto('/biens')
  117 |   await page.click(`text=${PROPERTY_ADDRESS}`)
  118 |   await page.waitForURL(/\/properties\//)
  119 | 
  120 |   // Sauvegarder
  121 |   await page.getByRole('button', { name: /Sauvegarder/ }).click()
  122 |   await expect(page.getByRole('button', { name: /Sauvegardé/ })).toBeVisible({ timeout: 5000 })
  123 | 
  124 |   // Vérifier dans /mes-favoris
  125 |   await page.goto('/mes-favoris')
  126 |   await expect(page.getByText(PROPERTY_ADDRESS)).toBeVisible()
  127 | })
  128 | 
  129 | test('Locataire contacte le propriétaire (création conversation)', async ({ page }) => {
  130 |   await page.goto('/login')
  131 |   await page.fill('input[type="email"]', TENANT.email)
  132 |   await page.fill('input[type="password"]', TENANT.password)
  133 |   await page.click('button[type="submit"]')
  134 |   await page.waitForURL(/\/dashboard/)
  135 | 
  136 |   await page.goto('/biens')
  137 |   await page.click(`text=${PROPERTY_ADDRESS}`)
  138 |   await page.waitForURL(/\/properties\//)
  139 | 
  140 |   await page.getByRole('button', { name: /Contacter le propriétaire/ }).click()
  141 |   await page.waitForURL(/\/messages\//, { timeout: 10000 })
  142 |   await expect(page.locator('input[placeholder*="message"]')).toBeVisible()
  143 | })
  144 | 
  145 | test('Locataire dépose une candidature avec docs', async ({ page }) => {
  146 |   test.setTimeout(60000)
  147 | 
  148 |   await page.goto('/login')
  149 |   await page.fill('input[type="email"]', TENANT.email)
  150 |   await page.fill('input[type="password"]', TENANT.password)
  151 |   await page.click('button[type="submit"]')
  152 |   await page.waitForURL(/\/dashboard/)
  153 | 
  154 |   await page.goto('/biens')
  155 |   await page.click(`text=${PROPERTY_ADDRESS}`)
  156 |   await page.waitForURL(/\/properties\//)
  157 |   await page.getByRole('link', { name: /Déposer ma candidature/ }).click()
  158 | 
  159 |   // Sélectionner durée
  160 |   await page.click('button:has-text("3 mois")')
  161 | 
  162 |   // Message
  163 |   await page.fill('textarea', 'Candidature automatique de test.')
  164 | 
  165 |   // Upload des 3 docs
  166 |   const fileInputs = await page.locator('input[type="file"]').all()
  167 |   for (const input of fileInputs) {
  168 |     await input.setInputFiles(TEST_IMAGE)
  169 |   }
  170 |   await page.waitForTimeout(1000)
  171 | 
  172 |   await page.click('button:has-text("Envoyer ma candidature"), button[type="submit"]')
  173 |   await page.waitForURL(/\/success/, { timeout: 30000 })
  174 |   await expect(page.getByText(/candidature/i)).toBeVisible()
  175 | })
  176 | 
  177 | test('Proprio voit la candidature dans son dashboard', async ({ page }) => {
  178 |   await page.goto('/login')
  179 |   await page.fill('input[type="email"]', OWNER.email)
  180 |   await page.fill('input[type="password"]', OWNER.password)
  181 |   await page.click('button[type="submit"]')
  182 |   await page.waitForURL(/\/dashboard/)
  183 | 
  184 |   // Cliquer sur "1 dossier"
  185 |   await page.click('a:has-text("dossier")')
  186 |   await page.waitForURL(/\/applications/)
> 187 |   await expect(page.getByText(TENANT.fullName)).toBeVisible({ timeout: 10000 })
      |                                                 ^ Error: expect(locator).toBeVisible() failed
  188 | })
  189 | 
```