'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'

type Estado = {
  sigla: string
  nome: string
}

type Cidade = {
  id: number
  nome: string
}

export function UsersFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [term, setTerm] = useState(searchParams.get('q') || '')
  const [selectedUf, setSelectedUf] = useState(searchParams.get('uf') || '')
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')

  const [estados, setEstados] = useState<Estado[]>([])
  const [cidades, setCidades] = useState<Cidade[]>([])

  // Carrega Estados do IBGE
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => setEstados(data))
      .catch(err => console.error('Erro ao buscar estados:', err))
  }, [])

  // Carrega Cidades quando a UF muda
  useEffect(() => {
    if (selectedUf) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
        .then(res => res.json())
        .then(data => setCidades(data))
        .catch(err => console.error('Erro ao buscar cidades:', err))
    } else {
      setCidades([])
    }
  }, [selectedUf])

  // Atualiza URL
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', '1')

      if (term) params.set('q', term)
      else params.delete('q')

      if (selectedUf) params.set('uf', selectedUf)
      else params.delete('uf')

      if (selectedCity) params.set('city', selectedCity)
      else params.delete('city')

      router.replace(`${pathname}?${params.toString()}`)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [term, selectedUf, selectedCity, pathname, router, searchParams])

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <label htmlFor="search" className="sr-only">Pesquisar por nome</label>
        <input
          id="search"
          className="peer block w-full rounded-md border border-[#DDD0C2] py-[9px] pl-10 text-sm outline-2 outline-[#B28F76] bg-[#F3EAE5] placeholder:text-[#B28F76]/70 text-[#B28F76]"
          placeholder="Pesquisar cliente por nome..."
          onChange={(e) => setTerm(e.target.value)}
          value={term}
        />
        <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#B28F76]" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <select
          className="rounded-md border border-[#DDD0C2] py-[9px] px-3 text-sm outline-2 outline-[#B28F76] bg-[#F3EAE5] text-[#B28F76]"
          value={selectedUf}
          onChange={(e) => {
            setSelectedUf(e.target.value)
            setSelectedCity('') // Reseta a cidade ao mudar a UF
          }}
        >
          <option value="">Todos os Estados</option>
          {estados.map(est => (
            <option key={est.sigla} value={est.sigla}>
              {est.nome} ({est.sigla})
            </option>
          ))}
        </select>

        <select
          className="rounded-md border border-[#DDD0C2] py-[9px] px-3 text-sm outline-2 outline-[#B28F76] bg-[#F3EAE5] text-[#B28F76] disabled:opacity-50"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedUf || cidades.length === 0}
        >
          <option value="">Todas as Cidades</option>
          {cidades.map(cid => (
            <option key={cid.id} value={cid.nome}>
              {cid.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
