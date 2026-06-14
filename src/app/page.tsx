import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { Search } from 'lucide-react'
import { Header } from '@/components/Header'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Busca a role de forma segura usando o admin client para evitar problemas de RLS
    const adminSupabase = createAdminClient()
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      redirect('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-[#F3EAE5] flex flex-col">
      <Header user={user} activePath="/" />

      {/* Main Content (Search Section) */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Espaço reservado para o logo */}
        <div className="h-32 w-full max-w-md mb-8 flex items-center justify-center">
          {/* Futuro Logo Aqui */}
        </div>

        <div className="w-full max-w-2xl">
          <form action="/produtos" method="GET" className="relative flex items-center">
            <label htmlFor="search" className="sr-only">Pesquisar produtos</label>
            <input
              id="search"
              name="search"
              type="text"
              placeholder="O que você está procurando hoje?"
              className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-[#DDD0C2] bg-[#ECE1D9] text-lg text-[#B28F76] placeholder:text-[#B28F76]/60 focus:outline-none focus:border-[#B28F76] focus:ring-1 focus:ring-[#B28F76] transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-3 p-2 bg-[#B28F76] text-[#F3EAE5] rounded-full hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-colors"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
