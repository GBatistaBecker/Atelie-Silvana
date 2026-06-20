'use client'

import { useState, useTransition } from 'react'
import { updateEmail } from '@/actions/profile'
import { Loader2 } from 'lucide-react'

interface ProfileFormProps {
  initialName: string
  initialEmail: string
}

export function ProfileForm({ initialName, initialEmail }: ProfileFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)

    if (email === initialEmail) {
      return
    }

    startTransition(async () => {
      const res = await updateEmail(email)
      if (res.error) {
        setStatus({ type: 'error', message: res.error })
      } else {
        setStatus({ type: 'success', message: 'E-mail atualizado com sucesso!' })
      }
    })
  }

  return (
    <div className="bg-[#ECE1D9] p-6 rounded-xl border border-[#DDD0C2] shadow-sm mb-8">
      <h2 className="text-xl font-heading font-bold text-[#B28F76] mb-6">Dados da Conta</h2>
      
      {status && (
        <div className={`p-4 mb-6 rounded-md text-sm border ${status.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6 max-w-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#B28F76] mb-2">
            Nome Completo
          </label>
          <input
            id="name"
            type="text"
            value={initialName}
            disabled
            className="block w-full rounded-md border-0 py-2.5 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] bg-[#F3EAE5] opacity-70 cursor-not-allowed sm:text-sm sm:leading-6"
          />
          <p className="mt-1 text-xs text-[#B28F76]/70">O nome não pode ser alterado no momento.</p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#B28F76] mb-2">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border-0 py-2.5 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] focus:ring-2 focus:ring-inset focus:ring-[#B28F76] bg-[#F3EAE5] sm:text-sm sm:leading-6"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending || email === initialEmail}
            className="flex items-center gap-2 bg-[#B28F76] text-white px-6 py-2 rounded-md font-medium hover:bg-[#D2B6A2] transition-colors disabled:opacity-50"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {isPending ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
