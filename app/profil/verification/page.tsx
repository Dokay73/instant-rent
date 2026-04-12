'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function VerificationPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [hasPhone, setHasPhone] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      setEmail(data.user.email ?? '')
      setEmailVerified(!!data.user.email_confirmed_at)
      supabase.from('profiles').select('phone').eq('id', data.user.id).single()
        .then(({ data: p }) => setHasPhone(!!p?.phone))
    })
  }, [])

  async function sendVerificationEmail() {
    await supabase.auth.resend({ type: 'signup', email })
    setEmailSent(true)
  }

  const Badge = ({ ok }: { ok: boolean }) => (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
      ok ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
    }`}>
      {ok ? (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Vérifié
        </>
      ) : (
        <>⚠ Non vérifié</>
      )}
    </span>
  )

  return (
    <div className="space-y-4">
      <div className="bg-[#0B1F4B]/5 border border-[#0B1F4B]/10 rounded-2xl p-5">
        <p className="text-sm text-[#0B1F4B]/70 leading-relaxed">
          En vérifiant vos informations, vous apparaissez comme un utilisateur de confiance auprès des propriétaires et locataires.
        </p>
      </div>

      {/* Email */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Étape 1</p>
            <h3 className="text-sm font-semibold text-slate-900">Adresse email</h3>
          </div>
          <Badge ok={emailVerified} />
        </div>

        {!emailVerified ? (
          <div>
            <p className="text-sm text-slate-600 mb-4">
              Nous allons vous envoyer un lien de vérification à <strong>{email}</strong>.
            </p>
            {emailSent ? (
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Email envoyé — vérifiez votre boîte de réception
              </div>
            ) : (
              <button
                onClick={sendVerificationEmail}
                className="bg-[#0B1F4B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#142d6b] transition-colors"
              >
                Envoyer le lien de vérification
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Votre adresse email est vérifiée.</p>
        )}
      </div>

      {/* Téléphone */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Étape 2</p>
            <h3 className="text-sm font-semibold text-slate-900">Numéro de téléphone</h3>
          </div>
          <Badge ok={hasPhone} />
        </div>
        <p className="text-sm text-slate-500">
          {hasPhone ? (
            'Votre numéro de téléphone est renseigné.'
          ) : (
            <>Ajoutez votre téléphone dans <a href="/profil" className="text-[#4A6CF7] hover:underline">Mon profil</a>.</>
          )}
        </p>
      </div>

      {/* Identité */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Étape 3</p>
            <h3 className="text-sm font-semibold text-slate-900">Pièce d&apos;identité</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-400">
            Optionnel
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Votre pièce d&apos;identité est collectée lors de vos candidatures de location — pas besoin de la renseigner ici.
        </p>
      </div>
    </div>
  )
}
