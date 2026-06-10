import Link from 'next/link'
import { LayoutDashboard, Package, LogOut } from 'lucide-react'
import { signOut } from '@/actions/auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F3EAE5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#ECE1D9] border-r border-[#DDD0C2] flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-heading font-bold text-[#B28F76]">Painel Admin</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-[#B28F76] hover:bg-[#DDD0C2] transition-colors"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            href="/admin/produtos"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-[#B28F76] hover:bg-[#DDD0C2] transition-colors"
          >
            <Package size={20} />
            Produtos
          </Link>
        </nav>
        <div className="p-4 border-t border-[#DDD0C2]">
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
