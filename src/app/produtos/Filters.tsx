'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const sort = searchParams.get('sort') || 'relevance'
  const search = searchParams.get('search') || ''

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newSort === 'relevance') {
      params.delete('sort')
    } else {
      params.set('sort', newSort)
    }
    router.push(`/produtos?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
         {search && <span className="text-[#B28F76] font-medium">Buscando por: &quot;{search}&quot;</span>}
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="sort" className="text-[#B28F76] font-medium whitespace-nowrap">Ordenar por:</label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full sm:w-auto bg-[#ECE1D9] text-[#B28F76] border border-[#DDD0C2] rounded-md px-3 py-2 focus:outline-none focus:border-[#B28F76] transition-colors shadow-sm cursor-pointer"
        >
          <option value="relevance">Padrão / Relevância</option>
          <option value="price_asc">Menor Preço</option>
          <option value="price_desc">Maior Preço</option>
        </select>
      </div>
    </div>
  )
}
