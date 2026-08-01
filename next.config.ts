import type { NextConfig } from "next";

// En-têtes de sécurité appliqués à toutes les réponses. Sûrs (n'altèrent pas le
// rendu), haute valeur défensive : anti-clickjacking, anti-sniffing, HSTS, fuite
// de referrer minimisée, APIs navigateur sensibles coupées par défaut.
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig;
