'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  // Update input if the URL changes externally
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Maintain existing params like sort
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim())
    } else {
      params.delete('search')
    }
    
    // Always push to /produtos to ensure the search goes to the catalog
    router.push(`/produtos?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-lg mx-auto">
      <label htmlFor="header-search" className="sr-only">Pesquisar produtos</label>
      <input
        id="header-search"
        type="text"
        placeholder="Buscar produtos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-4 pr-10 py-2 rounded-full border border-[#DDD0C2] bg-[#F3EAE5] text-sm text-[#B28F76] placeholder:text-[#B28F76]/60 focus:outline-none focus:border-[#B28F76] focus:ring-1 focus:ring-[#B28F76] transition-all shadow-sm"
      />
      <button
        type="submit"
        className="absolute right-2 p-1.5 text-[#B28F76] hover:bg-[#DDD0C2] hover:text-[#B28F76] rounded-full transition-colors"
        aria-label="Buscar"
      >
        <Search size={16} />
      </button>
    </form>
  )
}
