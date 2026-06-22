import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { OrderCardAdmin } from './OrderCardAdmin'

export const dynamic = 'force-dynamic'

export default async function PedidosPendentes() {
  const supabase = createAdminClient()

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      total_price,
      status,
      created_at,
      user:profiles(name, email),
      address:addresses(
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zip_code
      ),
      order_items(
        id,
        quantity,
        custom_description,
        product:products(name)
      )
    `)
    // Filtrar todos para permitir mudar de volta caso haja erro, ou apenas remover "Entregue" 
    // Para dar flexibilidade total, listamos todos (o admin pode ver tudo aqui). 
    // .neq('status', 'Entregue') // (Opcional, mas deixaremos todos por enquanto para teste)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-[#B28F76]">Gestão de Pedidos</h1>
        <Link 
          href="/admin"
          className="text-[#B28F76] hover:underline"
        >
          Voltar ao Dashboard
        </Link>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-lg p-8 text-center text-[#B28F76]">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order: any) => (
            <OrderCardAdmin key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
