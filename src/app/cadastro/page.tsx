'use client'

import Link from 'next/link'
import { signUp } from '@/actions/auth'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Estados dos campos
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [zipCode, setZipCode] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  const handleCepChange = async (val: string) => {
    // Formata removendo não números
    const rawCep = val.replace(/\D/g, '')
    // Aplica máscara (00000-000)
    let formattedCep = rawCep
    if (rawCep.length > 5) {
      formattedCep = `${rawCep.slice(0, 5)}-${rawCep.slice(5, 8)}`
    }
    setZipCode(formattedCep)

    if (rawCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`)
        const data = await res.json()

        if (!data.erro) {
          setStreet(data.logradouro || '')
          setNeighborhood(data.bairro || '')
          setCity(data.localidade || '')
          setState(data.uf || '')
          // Foca no número automaticamente
          document.getElementById('number')?.focus()
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err)
      }
    }
  }

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      setError(null)
      const res = await signUp(formData)
      if (res?.error) {
        setError(res.error)
      } else if (res?.success) {
        router.push('/')
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F3EAE5]">
      <Header user={null} />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8 bg-[#ECE1D9] p-8 rounded-xl shadow-sm border border-[#DDD0C2]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-heading font-bold tracking-tight text-[#B28F76]">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-[#B28F76]">
            Ou{' '}
            <Link href="/login" className="font-medium hover:text-[#D2B6A2] transition-colors">
              faça login se já possui uma
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action={handleAction}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-bold text-[#B28F76]">Dados Pessoais</h3>
              <input
                name="name"
                type="text"
                required
                className="relative block w-full rounded-md border-0 py-2 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] placeholder:text-[#D2B6A2] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#B28F76] sm:text-sm sm:leading-6 bg-[#F3EAE5]"
                placeholder="Nome completo"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                name="email"
                type="email"
                required
                className="relative block w-full rounded-md border-0 py-2 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] placeholder:text-[#D2B6A2] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#B28F76] sm:text-sm sm:leading-6 bg-[#F3EAE5]"
                placeholder="Endereço de e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                name="password"
                type="password"
                required
                className="relative block w-full rounded-md border-0 py-2 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] placeholder:text-[#D2B6A2] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#B28F76] sm:text-sm sm:leading-6 bg-[#F3EAE5]"
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {/* Endereço */}
            <div className="space-y-4 pt-4 border-t border-[#DDD0C2]">
              <h3 className="text-lg font-heading font-bold text-[#B28F76]">Endereço de Entrega</h3>
              
              <input
                name="zip_code"
                type="text"
                required
                maxLength={9}
                className="relative block w-full md:w-1/2 rounded-md border-0 py-2 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] placeholder:text-[#D2B6A2] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#B28F76] sm:text-sm sm:leading-6 bg-[#F3EAE5]"
                placeholder="CEP"
                value={zipCode}
                onChange={e => handleCepChange(e.target.value)}
              />

              <div className="flex flex-col md:flex-row gap-4">
                <input
                  name="street"
                  type="text"
                  required
                  className="relative block w-full md:w-3/4 rounded-md border-0 py-2 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] placeholder:text-[#D2B6A2] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#B28F76] sm:text-sm sm:leading-6 bg-[#F3EAE5]"
                  placeholder="Rua / Logradouro"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                />
                <input
                  id="number"
                  name="number"
                  type="text"
                  required
                  className="relative block w-full md:w-1/4 rounded-md border-0 py-2 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] placeholder:text-[#D2B6A2] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#B28F76] sm:text-sm sm:leading-6 bg-[#F3EAE5]"
                  placeholder="Número"
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <input
                  name="complement"
                  type="text"
                  className="relative block w-full md:w-1/2 rounded-md border-0 py-2 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] placeholder:text-[#D2B6A2] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#B28F76] sm:text-sm sm:leading-6 bg-[#F3EAE5]"
                  placeholder="Complemento (Opcional)"
                  value={complement}
                  onChange={e => setComplement(e.target.value)}
                />
                <input
                  name="neighborhood"
                  type="text"
                  required
                  className="relative block w-full md:w-1/2 rounded-md border-0 py-2 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] placeholder:text-[#D2B6A2] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#B28F76] sm:text-sm sm:leading-6 bg-[#F3EAE5]"
                  placeholder="Bairro"
                  value={neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <input
                  name="city"
                  type="text"
                  required
                  className="relative block w-full md:w-3/4 rounded-md border-0 py-2 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] placeholder:text-[#D2B6A2] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#B28F76] sm:text-sm sm:leading-6 bg-[#F3EAE5]"
                  placeholder="Cidade"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
                <input
                  name="state"
                  type="text"
                  required
                  maxLength={2}
                  className="relative block w-full md:w-1/4 rounded-md border-0 py-2 px-3 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] placeholder:text-[#D2B6A2] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#B28F76] sm:text-sm sm:leading-6 bg-[#F3EAE5] uppercase"
                  placeholder="UF"
                  value={state}
                  onChange={e => setState(e.target.value.toUpperCase())}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-md bg-[#B28F76] px-3 py-2 text-sm font-semibold text-white hover:bg-[#D2B6A2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B28F76] transition-colors disabled:opacity-50"
            >
              {isPending ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}
