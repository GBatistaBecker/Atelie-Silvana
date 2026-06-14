import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Header } from '@/components/Header'
import { Filters } from './Filters'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const adminSupabase = createAdminClient()
  
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : ''
  const sort = typeof params.sort === 'string' ? params.sort : 'relevance'

  let query = adminSupabase.from('products').select('*')

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: products } = await query

  return (
    <div className="min-h-screen bg-[#F3EAE5] flex flex-col">
      <Header user={user} activePath="/produtos" />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-heading font-bold text-[#B28F76] mb-8">Catálogo de Produtos</h1>
        
        <Filters />

        {(!products || products.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#ECE1D9] rounded-xl border border-[#DDD0C2] shadow-sm">
            <p className="text-[#B28F76] font-medium text-lg">Nenhum produto encontrado com estes filtros.</p>
            <Link href="/produtos" className="mt-4 px-6 py-2 bg-[#B28F76] text-[#F3EAE5] font-medium rounded-md hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-colors shadow-sm">
              Limpar Busca
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <Link href={`/produtos/${product.id}`} key={product.id} className="group bg-[#ECE1D9] rounded-xl overflow-hidden border border-[#DDD0C2] hover:border-[#D2B6A2] transition-colors shadow-sm flex flex-col h-full">
                <div className="relative aspect-square w-full bg-[#F3EAE5]">
                  {product.image_url ? (
                    <Image 
                      src={product.image_url} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#B28F76]/50">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-lg text-[#B28F76] mb-1 line-clamp-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-[#B28F76]/80 mb-4 line-clamp-2 flex-1">{product.description}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-heading font-bold text-[#B28F76]">R$ {Number(product.price).toFixed(2).replace('.', ',')}</span>
                    <span className="text-sm font-medium text-[#B28F76] bg-[#DDD0C2]/50 px-3 py-1 rounded-full group-hover:bg-[#D2B6A2] group-hover:text-white transition-colors">Ver Detalhes</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
