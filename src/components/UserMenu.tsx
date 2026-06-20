'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, User, ShoppingBag, LogOut } from 'lucide-react'
import { signOut } from '@/actions/auth'

interface UserMenuProps {
  userName: string
}

export function UserMenu({ userName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-[#F3EAE5] text-[#B28F76] font-medium rounded-md border border-[#DDD0C2] hover:bg-[#DDD0C2] transition-colors shadow-sm text-sm sm:text-base"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className="hidden sm:inline font-heading font-bold truncate max-w-[120px]">
          {userName}
        </span>
        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#ECE1D9] border border-[#DDD0C2] rounded-md shadow-lg z-50 overflow-hidden flex flex-col py-1">
          {/* Aparece apenas no mobile se o nome estiver oculto no botão */}
          <div className="px-4 py-3 border-b border-[#DDD0C2] sm:hidden">
            <p className="text-sm font-medium text-[#B28F76] truncate">{userName}</p>
          </div>
          
          <Link 
            href="/profile" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#B28F76] hover:bg-[#DDD0C2] transition-colors"
          >
            <User size={16} />
            Editar Perfil
          </Link>
          
          <Link 
            href="/profile/orders" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#B28F76] hover:bg-[#DDD0C2] transition-colors"
          >
            <ShoppingBag size={16} />
            Histórico de Compras
          </Link>
          
          <div className="border-t border-[#DDD0C2] my-1" />
          
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center w-full gap-3 px-4 py-3 text-sm text-[#B28F76] hover:bg-[#DDD0C2] transition-colors text-left"
            >
              <LogOut size={16} />
              Sair
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
