import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { FileClock, DollarSign, Users, Package } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  // 1. Pedidos Pendentes
  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // 2. Total em Vendas (soma de total_price em orders, podemos filtrar status = paid/shipped ou all)
  const { data: salesData } = await supabase
    .from('orders')
    .select('total_price')
    //.eq('status', 'paid') // Dependendo da regra, podemos descomentar. 

  const totalSales = salesData?.reduce((acc, order) => acc + Number(order.total_price), 0) || 0

  // 3. Total de Clientes
  const { count: totalClients } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')

  // 4. Catálogo de Produtos
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-[#B28F76]">Dashboard Estratégico</h1>
        <Link
          href="/admin/pedidos-pendentes"
          className="flex items-center gap-2 bg-[#B28F76] text-[#F3EAE5] px-6 py-3 rounded-md hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-colors font-medium shadow-sm"
        >
          <FileClock size={20} />
          Visualizar Pedidos Pendentes
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card: Pedidos Pendentes */}
        <div className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="bg-[#DDD0C2] p-3 rounded-full mb-4">
            <FileClock className="text-[#B28F76]" size={28} />
          </div>
          <h2 className="text-sm uppercase tracking-wider text-[#B28F76] font-semibold mb-1">Pedidos Pendentes</h2>
          <p className="text-4xl font-heading font-bold text-[#B28F76]">{pendingOrders || 0}</p>
        </div>

        {/* Card: Total em Vendas */}
        <div className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="bg-[#DDD0C2] p-3 rounded-full mb-4">
            <DollarSign className="text-[#B28F76]" size={28} />
          </div>
          <h2 className="text-sm uppercase tracking-wider text-[#B28F76] font-semibold mb-1">Total em Vendas</h2>
          <p className="text-4xl font-heading font-bold text-[#B28F76]">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSales)}
          </p>
        </div>

        {/* Card: Total de Clientes */}
        <div className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="bg-[#DDD0C2] p-3 rounded-full mb-4">
            <Users className="text-[#B28F76]" size={28} />
          </div>
          <h2 className="text-sm uppercase tracking-wider text-[#B28F76] font-semibold mb-1">Total de Clientes</h2>
          <p className="text-4xl font-heading font-bold text-[#B28F76]">{totalClients || 0}</p>
        </div>

        {/* Card: Catálogo de Produtos */}
        <div className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="bg-[#DDD0C2] p-3 rounded-full mb-4">
            <Package className="text-[#B28F76]" size={28} />
          </div>
          <h2 className="text-sm uppercase tracking-wider text-[#B28F76] font-semibold mb-1">Produtos no Catálogo</h2>
          <p className="text-4xl font-heading font-bold text-[#B28F76]">{totalProducts || 0}</p>
        </div>
      </div>
    </div>
  )
}
