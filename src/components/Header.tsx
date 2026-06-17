import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { signOut } from '@/actions/auth'
import type { User } from '@supabase/supabase-js'
import { CartBadge } from './CartBadge'

interface HeaderProps {
  user: User | null
  activePath?: string
}

export function Header({ user, activePath }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#DDD0C2] bg-[#ECE1D9]">
      <nav className="flex items-center gap-6">
        <Link href="/" className={`text-lg font-heading ${activePath === '/' ? 'font-bold underline underline-offset-4 decoration-2' : 'font-medium hover:text-[#D2B6A2] transition-colors'} text-[#B28F76]`}>
          Home
        </Link>
        <Link href="/produtos" className={`text-lg font-heading ${activePath === '/produtos' ? 'font-bold underline underline-offset-4 decoration-2' : 'font-medium hover:text-[#D2B6A2] transition-colors'} text-[#B28F76]`}>
          Produtos
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <CartBadge />
        {user ? (
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-[#F3EAE5] text-[#B28F76] font-medium rounded-md border border-[#DDD0C2] hover:bg-[#DDD0C2] transition-colors shadow-sm"
            >
              <LogOut size={18} />
              Fazer Logout
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-[#B28F76] font-medium hover:text-[#D2B6A2] transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="px-4 py-2 bg-[#B28F76] text-[#F3EAE5] font-medium rounded-md hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-colors shadow-sm"
            >
              Cadastrar
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
