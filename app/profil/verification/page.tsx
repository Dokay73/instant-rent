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
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
      ok ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
    }`}>
      {ok ? '✓ Vérifié' : '⚠ Non vérifié'}
    </span>
  )

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 bg-blue-50 border border-blue-100 rounded-xl p-4">
        En vérifiant vos informations, vous apparaissez comme un utilisateur de confiance auprès des autres membres.
      </p>

      {/* Email */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">1. Adresse email</h3>
          <Badge ok={emailVerified} />
        </div>
        {!emailVerified ? (
          <div>
            <p className="text-sm text-slate-600 mb-3">
              Nous allons vous envoyer un email à <strong>{email}</strong>. Cliquez sur le lien de validation.
            </p>
            {emailSent ? (
              <p className="text-sm text-green-600 font-medium">✓ Email envoyé ! Vérifiez votre boîte.</p>
            ) : (
              <button onClick={sendVerificationEmail}
                className="bg-gradient-to-r from-[#4A6CF7] to-[#8B5CF6] text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Envoyer l&apos;email de vérification
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Votre adresse email est vérifiée.</p>
        )}
      </div>

      {/* Téléphone */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">2. Numéro de téléphone</h3>
          <Badge ok={hasPhone} />
        </div>
        <p className="text-sm text-slate-500">
          {hasPhone
            ? 'Votre numéro de téléphone est renseigné.'
            : <>Ajoutez votre téléphone dans <a href="/profil" className="text-[#4A6CF7] underline">Mon profil</a>.</>
          }
        </p>
      </div>

      {/* Identité */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">3. Pièce d&apos;identité</h3>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-500">
            Optionnel
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Votre pièce d&apos;identité est déjà collectée lors de vos candidatures de location.
        </p>
      </div>
    </div>
  )
}
