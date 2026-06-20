import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Header } from '@/components/Header'
import { redirect } from 'next/navigation'
import { OrdersClient } from './OrdersClient'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/profile/orders')
  }

  const supabaseAdmin = createAdminClient()

  // Fetch orders along with items and product details
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_purchase,
        custom_description,
        product:products (
          name,
          price
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar pedidos:', error)
  }

  return (
    <div className="min-h-screen bg-[#F3EAE5] flex flex-col">
      <Header user={user} activePath="/profile/orders" />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-[#B28F76]">Histórico de Compras</h1>
          <p className="text-[#B28F76] mt-2">Acompanhe e visualize todos os pedidos que você já realizou.</p>
        </div>

        <OrdersClient initialOrders={orders || []} />
      </main>
    </div>
  )
}
