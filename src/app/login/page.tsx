'use client'

import Link from 'next/link'
import { signIn } from '@/actions/auth'
import { useState, useTransition } from 'react'
import { Header } from '@/components/Header'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      setError(null)
      const res = await signIn(formData)
      if (res?.error) {
        setError(res.error)
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F3EAE5]">
      <Header user={null} />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-[#ECE1D9] p-8 rounded-xl shadow-sm border border-[#DDD0C2]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-heading font-bold tracking-tight text-[#B28F76]">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-[#B28F76]">
            Ou{' '}
            <Link href="/cadastro" className="font-medium hover:text-[#D2B6A2] transition-colors">
              crie uma nova conta
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action={handleAction}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                E-mail
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border-0 py-2 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] placeholder:text-[#D2B6A2] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#B28F76] sm:text-sm sm:leading-6 bg-[#F3EAE5]"
                placeholder="Endereço de e-mail"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-md border-0 py-2 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] placeholder:text-[#D2B6A2] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#B28F76] sm:text-sm sm:leading-6 bg-[#F3EAE5]"
                placeholder="Senha"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-md bg-[#B28F76] px-3 py-2 text-sm font-semibold text-white hover:bg-[#D2B6A2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B28F76] transition-colors disabled:opacity-50"
            >
              {isPending ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}
