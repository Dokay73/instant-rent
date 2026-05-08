// Mode de lancement de l'app
// Pendant 'pre_launch' : les pages publiques /biens et /properties/[id]
// affichent un message "Coming soon" au lieu du contenu réel
// (sauf pour les admins qui voient tout normalement)
// Pendant 'live' : comportement normal

export type LaunchMode = 'pre_launch' | 'live'

export function getLaunchMode(): LaunchMode {
  return (process.env.NEXT_PUBLIC_LAUNCH_MODE === 'pre_launch') ? 'pre_launch' : 'live'
}

export function isPreLaunch(): boolean {
  return getLaunchMode() === 'pre_launch'
}

export const ADMIN_EMAILS = ['hakangdz91@gmail.com']

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email)
}
