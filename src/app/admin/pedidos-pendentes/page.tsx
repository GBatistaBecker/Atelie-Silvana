import { createAdminClient } from '@/lib/supabase/admin'
import { Package, Truck, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PedidosPendentes() {
  const supabase = createAdminClient()

  // Buscar pedidos com status pending (e talvez paid se pending não for o único não-finalizado)
  // Para essa interface estratégica, consideraremos 'pending' e 'paid' como pedidos para despachar
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      total_price,
      status,
      created_at,
      user:profiles(name, email)
    `)
    .in('status', ['pending', 'paid'])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-[#B28F76]">Gestão de Pedidos Pendentes</h1>
        <Link 
          href="/admin"
          className="text-[#B28F76] hover:underline"
        >
          Voltar ao Dashboard
        </Link>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-lg p-8 text-center text-[#B28F76]">
          Nenhum pedido pendente no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-lg p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-sm text-[#B28F76] mb-1 font-semibold">ID do Pedido: <span className="font-normal opacity-80">{order.id}</span></p>
                <p className="text-lg font-heading text-[#B28F76]">Cliente: {order.user?.name || 'Cliente Desconhecido'}</p>
                <p className="text-sm text-[#B28F76] mt-1">
                  Data: {new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR')}
                </p>
                <p className="text-sm font-semibold text-[#B28F76] mt-2">
                  Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_price)}
                </p>
                <span className="inline-block mt-3 px-3 py-1 bg-[#DDD0C2] text-[#B28F76] text-xs font-bold rounded-full uppercase tracking-wide">
                  {order.status}
                </span>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#F3EAE5] border border-[#B28F76] text-[#B28F76] rounded hover:bg-[#DDD0C2] transition-colors w-full md:w-48 text-sm font-semibold">
                  <Package size={16} />
                  Marcar como Pronto
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#B28F76] text-[#F3EAE5] rounded hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-colors w-full md:w-48 text-sm font-semibold">
                  <Truck size={16} />
                  Despachar Entrega
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
