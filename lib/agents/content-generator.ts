import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `Tu es l'agent marketing d'**Instant Rent**, une plateforme web SaaS française de location flexible sous Bail Code Civil.

## Concept Instant Rent

- **Pour les propriétaires** : publier leur bien gratuitement, recevoir des candidatures avec dossiers vérifiés (pièce d'identité, contrat de travail, justificatif domicile), signer un bail Code Civil 100% en ligne
- **Pour les locataires** : trouver un logement flexible (1 à 24 mois), candidater en ligne, signer électroniquement
- **Tarif unique** : 29€/mois/bien loué (gratuit si vacant, sans engagement)
- **Différence avec un bail classique** : bail Code Civil = plus de flexibilité, durée libre, pour usage temporaire/secondaire (pas résidence principale)

## Phase actuelle

L'app est en **beta privée**. URL : instant-rent-six.vercel.app
Une page d'inscription waitlist existe : instant-rent-six.vercel.app/early-access
Une communauté Discord : https://discord.gg/BR8UsZJYJ

## Cibles

- **Propriétaires** : particuliers ou pros qui ont un studio/T1/T2 à louer en courte/moyenne durée. Souvent dans les groupes Facebook immobilier, sur LeBonCoin, sur SeLoger.
- **Locataires** : étudiants, stagiaires, mobilité pro, situations transitoires. Cherchent du flexible.

## Ton et style

- Direct, concret, pas de bullshit
- Français naturel et chaleureux
- Pas de tournures commerciales lourdes ("révolutionnaire", "incroyable")
- Inclure un appel clair à l'action avec le lien
- Adapté au support : un post Facebook ne ressemble pas à une annonce LeBonCoin
- Toujours en français

## Mission

Tu vas générer aujourd'hui 3 contenus différents à publier ou envoyer. Sois créatif et varie les angles d'approche.`

const USER_PROMPT = `Génère 3 contenus pour aujourd'hui. Chaque contenu doit être différent en angle et adapté à son support.

**Contenu 1 — Post Facebook** (à publier dans des groupes "Propriétaires bailleurs France", "Location immobilière", etc.)
- 80-150 mots
- Hook fort dès la première ligne
- Bénéfices concrets pour le proprio (gain de temps, fiabilité, flexibilité)
- Appel à l'action vers /early-access ou Discord
- Variéte les angles : témoignage, problème résolu, comparaison avec agence, etc.

**Contenu 2 — Annonce LeBonCoin** (à publier dans la catégorie "Colocations" ou "Locations" en utilisant un faux profil — on imagine un bien fictif pour démo)
- Format annonce immobilière classique : titre + description
- Mentionner que c'est sur Instant Rent avec lien
- Mettre en valeur la flexibilité de la durée (1 à 24 mois)

**Contenu 3 — Message DM personnalisé** (à envoyer à un propriétaire qu'on a repéré dans un groupe Facebook)
- 60-100 mots
- Personnel, pas générique
- Aborder un point précis (ex: il a écrit qu'il cherche un locataire fiable rapidement)
- Mentionner Instant Rent comme une option
- Lien vers /early-access

Réponds en JSON strict (sans bloc de code markdown) avec cette structure :
{
  "facebook_post": {
    "title": "Titre court descriptif (max 60 chars)",
    "content": "Le post complet"
  },
  "leboncoin_ad": {
    "title": "Titre de l'annonce",
    "content": "La description complète"
  },
  "dm_template": {
    "title": "Description de la situation cible",
    "content": "Le message complet"
  }
}`

export async function generateDailyContent(context?: {
  recentContents?: Array<{ type: string; title: string; status: string; created_at: string }>
  waitlistCount?: number
  recentCities?: string[]
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY manquante')

  const client = new Anthropic({ apiKey })

  let memoryBlock = ''
  if (context?.recentContents && context.recentContents.length > 0) {
    memoryBlock = `\n\n## Contenus déjà publiés récemment (NE PAS les répéter, varier les angles)\n${
      context.recentContents.map(c => `- [${c.type}] ${c.title} (${c.status})`).join('\n')
    }`
  }
  if (context?.waitlistCount) {
    memoryBlock += `\n\n## Inscrits waitlist actuels : ${context.waitlistCount} propriétaires`
    if (context.recentCities && context.recentCities.length > 0) {
      memoryBlock += ` (villes représentées : ${context.recentCities.slice(0, 5).join(', ')})`
    }
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    system: SYSTEM_PROMPT + memoryBlock,
    messages: [{ role: 'user', content: USER_PROMPT }],
  })

  const textBlock = message.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Pas de réponse texte')
  }

  // Nettoyer la réponse au cas où Claude ajoute du texte autour
  let raw = textBlock.text.trim()
  if (raw.startsWith('```json')) raw = raw.replace(/^```json\s*/, '').replace(/\s*```$/, '')
  if (raw.startsWith('```')) raw = raw.replace(/^```\s*/, '').replace(/\s*```$/, '')

  const parsed = JSON.parse(raw)

  return [
    { type: 'facebook_post', title: parsed.facebook_post.title, content: parsed.facebook_post.content },
    { type: 'leboncoin_ad', title: parsed.leboncoin_ad.title, content: parsed.leboncoin_ad.content },
    { type: 'dm_template', title: parsed.dm_template.title, content: parsed.dm_template.content },
  ]
}
