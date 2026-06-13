'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SearchInput() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  
  const [term, setTerm] = useState(searchParams.get('q') || '')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', '1') // Reseta para a página 1 em nova busca
      if (term) {
        params.set('q', term)
      } else {
        params.delete('q')
      }
      replace(`${pathname}?${params.toString()}`)
    }, 500) // 500ms debounce

    return () => clearTimeout(delayDebounceFn)
  }, [term, pathname, replace, searchParams])

  return (
    <div className="relative flex flex-1 flex-shrink-0 w-full md:w-80">
      <label htmlFor="search" className="sr-only">
        Pesquisar
      </label>
      <input
        id="search"
        className="peer block w-full rounded-md border border-[#DDD0C2] py-[9px] pl-10 text-sm outline-2 outline-[#B28F76] bg-[#F3EAE5] placeholder:text-[#B28F76]/70 text-[#B28F76]"
        placeholder="Pesquisar cliente por nome..."
        onChange={(e) => setTerm(e.target.value)}
        value={term}
      />
      <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#B28F76]" />
    </div>
  )
}
