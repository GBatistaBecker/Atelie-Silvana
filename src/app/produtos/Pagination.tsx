'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/produtos?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 bg-[#ECE1D9] text-[#B28F76] rounded-md border border-[#DDD0C2] hover:bg-[#D2B6A2] hover:text-[#F3EAE5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        aria-label="Página anterior"
      >
        <ChevronLeft size={20} />
      </button>
      
      <span className="text-[#B28F76] font-medium">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 bg-[#ECE1D9] text-[#B28F76] rounded-md border border-[#DDD0C2] hover:bg-[#D2B6A2] hover:text-[#F3EAE5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        aria-label="Próxima página"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
