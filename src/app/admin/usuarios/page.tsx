import { createClient } from '@/lib/supabase/server'
import { Pagination } from '@/components/admin/Pagination'
import { UsersFilters } from '@/components/admin/UsersFilters'

export const dynamic = 'force-dynamic'

const ITEMS_PER_PAGE = 10

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams?: { q?: string; uf?: string; city?: string; page?: string }
}) {
  const params = await searchParams
  const q = params?.q || ''
  const uf = params?.uf || ''
  const city = params?.city || ''
  const currentPage = Number(params?.page) || 1

  const supabase = await createClient()

  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  // Para garantir que filtramos pelos profiles e seus endereços, usamos o addresses!inner
  // Assim a query ignora quem não bater com a condição de cidade/estado.
  // Como um cliente poderia ter mais de um endereço, em teoria, isso pode duplicar linhas
  // se houver múltiplos endereços. No entanto, em um caso padrão, assumimos 1:1 ou filtramos.
  let queryBuilder = supabase
    .from('profiles')
    .select(`
      id,
      name,
      email,
      created_at,
      addresses!inner(street, number, complement, neighborhood, city, state, zip_code)
    `, { count: 'exact' })
    .eq('role', 'client')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (q) {
    queryBuilder = queryBuilder.ilike('name', `%${q}%`)
  }

  if (uf) {
    queryBuilder = queryBuilder.eq('addresses.state', uf)
  }

  if (city) {
    queryBuilder = queryBuilder.eq('addresses.city', city)
  }

  const { data: users, count, error } = await queryBuilder

  if (error) {
    console.error('Erro ao buscar usuários:', error)
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-[#B28F76]">Gerenciamento de Clientes</h1>
      </div>

      <div className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-lg p-6 shadow-sm">
        <UsersFilters />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDD0C2]">
                <th className="pb-3 text-[#B28F76] font-semibold">Nome do Cliente</th>
                <th className="pb-3 text-[#B28F76] font-semibold">E-mail</th>
                <th className="pb-3 text-[#B28F76] font-semibold">Endereço Completo</th>
              </tr>
            </thead>
            <tbody>
              {(!users || users.length === 0) ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-[#B28F76]">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                users.map((user: any) => {
                  // O inner join pode retornar um array de endereços dependendo de como 
                  // o Supabase mapeia a relação foreign key. Vamos pegar o primeiro.
                  const address = Array.isArray(user.addresses) ? user.addresses[0] : user.addresses
                  
                  const addressString = address 
                    ? `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''} - ${address.neighborhood}, ${address.city} - ${address.state}`
                    : 'Endereço não cadastrado'

                  return (
                    <tr key={user.id} className="border-b border-[#DDD0C2] hover:bg-[#F3EAE5] transition-colors">
                      <td className="py-4 text-[#B28F76] font-bold">
                        {user.name}
                      </td>
                      <td className="py-4 text-[#B28F76]">
                        {user.email}
                      </td>
                      <td className="py-4 text-[#B28F76] text-sm">
                        {addressString}
                        {address?.zip_code && <span className="block opacity-75 mt-1 text-xs">CEP: {address.zip_code}</span>}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
