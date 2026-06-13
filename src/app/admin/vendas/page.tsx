import { createAdminClient } from '@/lib/supabase/admin'
import { SearchInput } from '@/components/admin/SearchInput'
import { Pagination } from '@/components/admin/Pagination'
import { ExportPdfButton } from '@/components/admin/ExportPdfButton'

export const dynamic = 'force-dynamic'

const ITEMS_PER_PAGE = 10

export default async function VendasPage({
  searchParams,
}: {
  searchParams?: { q?: string; page?: string }
}) {
  const params = await searchParams
  const query = params?.q || ''
  const currentPage = Number(params?.page) || 1

  const supabase = createAdminClient()

  // Calcular offsets para paginação (.range é zero-based e inclusivo nas duas pontas)
  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  let queryBuilder = supabase
    .from('orders')
    .select(`
      id,
      total_price,
      created_at,
      user:profiles!inner(name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    queryBuilder = queryBuilder.ilike('user.name', `%${query}%`)
  }

  const { data: orders, count, error } = await queryBuilder

  if (error) {
    console.error('Erro ao carregar histórico de vendas:', error)
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-[#B28F76]">Histórico de Vendas</h1>
        <ExportPdfButton query={query} />
      </div>

      <div className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-lg p-6 shadow-sm">
        <div className="mb-6 flex">
          <SearchInput />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDD0C2]">
                <th className="pb-3 text-[#B28F76] font-semibold">Cliente</th>
                <th className="pb-3 text-[#B28F76] font-semibold">Valor Total</th>
                <th className="pb-3 text-[#B28F76] font-semibold">Data</th>
              </tr>
            </thead>
            <tbody>
              {(!orders || orders.length === 0) ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-[#B28F76]">
                    Nenhuma venda encontrada.
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="border-b border-[#DDD0C2] hover:bg-[#F3EAE5] transition-colors">
                    <td className="py-4 text-[#B28F76] font-medium">
                      {order.user?.name || 'Cliente Desconhecido'}
                    </td>
                    <td className="py-4 text-[#B28F76]">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_price)}
                    </td>
                    <td className="py-4 text-[#B28F76]">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
