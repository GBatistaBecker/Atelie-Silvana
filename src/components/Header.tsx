import Link from 'next/link'
import { LogOut, Scissors } from 'lucide-react'
import { signOut } from '@/actions/auth'
import type { User } from '@supabase/supabase-js'
import { CartBadge } from './CartBadge'
import { SearchBar } from './SearchBar'

interface HeaderProps {
  user: User | null
  activePath?: string
}

export function Header({ user, activePath }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-b border-[#DDD0C2] bg-[#ECE1D9] gap-4 shadow-sm sticky top-0 z-50">
      
      {/* Esquerda: Logo e Navegação */}
      <div className="flex w-full md:w-auto items-center justify-between gap-6 order-1">
        <Link href="/" className="flex items-center gap-2 text-[#B28F76] hover:text-[#D2B6A2] transition-colors" aria-label="Logo Ateliê">
          <Scissors size={24} className="rotate-90" />
          <span className="font-heading font-bold text-xl hidden sm:block">Ateliê S.B.</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className={`text-base sm:text-lg font-heading ${activePath === '/' ? 'font-bold underline underline-offset-4 decoration-2' : 'font-medium hover:text-[#D2B6A2] transition-colors'} text-[#B28F76]`}>
            Home
          </Link>
          <Link href="/produtos" className={`text-base sm:text-lg font-heading ${activePath === '/produtos' ? 'font-bold underline underline-offset-4 decoration-2' : 'font-medium hover:text-[#D2B6A2] transition-colors'} text-[#B28F76]`}>
            Catálogo
          </Link>
        </nav>
      </div>

      {/* Centro: Barra de Busca */}
      <div className="w-full md:flex-1 md:max-w-md lg:max-w-xl px-0 md:px-4 order-3 md:order-2">
        <SearchBar />
      </div>

      {/* Direita: Auth e Carrinho */}
      <div className="flex w-full md:w-auto items-center justify-end gap-4 order-2 md:order-3">
        <CartBadge />
        {user ? (
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-[#F3EAE5] text-[#B28F76] font-medium rounded-md border border-[#DDD0C2] hover:bg-[#DDD0C2] transition-colors shadow-sm text-sm sm:text-base"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="text-[#B28F76] font-medium hover:text-[#D2B6A2] transition-colors text-sm sm:text-base"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="px-3 py-2 sm:px-4 bg-[#B28F76] text-[#F3EAE5] font-medium rounded-md hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-colors shadow-sm text-sm sm:text-base"
            >
              Cadastrar
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
