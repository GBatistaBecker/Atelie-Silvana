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

      {/* Main Content (Empty for now) */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        
      </main>
    </div>
  )
}
