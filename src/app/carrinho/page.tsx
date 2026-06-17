import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/Header'
import { CartClient } from './CartClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CarrinhoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/carrinho')
  }

  let addresses: any[] = []
  
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const supabaseAdmin = createAdminClient()

  const { data } = await supabaseAdmin
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (data) {
    addresses = data
  }

  return (
    <div className="min-h-screen bg-[#F3EAE5] flex flex-col">
      <Header user={user} activePath="/carrinho" />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-heading font-bold text-[#B28F76] mb-8">Seu Carrinho</h1>
        <CartClient addresses={addresses} />
      </main>
    </div>
  )
}
