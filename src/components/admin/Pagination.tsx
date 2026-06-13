'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const currentPage = Number(searchParams.get('page')) || 1

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const handleNavigate = (page: number) => {
    replace(createPageURL(page))
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <span className="text-sm text-[#B28F76] font-medium">
        Página {currentPage} de {totalPages || 1}
      </span>
      
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#ECE1D9] border border-[#DDD0C2] text-[#B28F76] hover:bg-[#DDD0C2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleNavigate(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={16} />
          Anterior
        </button>
        <button
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#ECE1D9] border border-[#DDD0C2] text-[#B28F76] hover:bg-[#DDD0C2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleNavigate(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Próxima
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
