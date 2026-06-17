import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Header } from '@/components/Header'
import { ProductImage } from './ProductImage'
import { AddToCart } from './AddToCart'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Use Admin Client just like in the products list to bypass any RLS issue reading public data
  const adminSupabase = createAdminClient()
  const { data: product, error } = await adminSupabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F3EAE5] flex flex-col">
        <Header user={user} activePath="/produtos" />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="bg-[#ECE1D9] p-12 rounded-xl border border-[#DDD0C2] text-center max-w-md shadow-sm">
            <h1 className="text-2xl font-heading font-bold text-[#B28F76] mb-4">Produto não encontrado</h1>
            <p className="text-[#B28F76]/80 mb-8">O item que você está procurando pode ter sido removido ou não existe.</p>
            <Link 
              href="/produtos" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#B28F76] text-[#F3EAE5] font-medium rounded-md hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-colors shadow-sm"
            >
              <ArrowLeft size={20} />
              Voltar ao Catálogo
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3EAE5] flex flex-col">
      <Header user={user} activePath="/produtos" />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/produtos" 
          className="inline-flex items-center gap-2 text-[#B28F76] hover:text-[#D2B6A2] font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar para Produtos
        </Link>

        <div className="bg-[#ECE1D9] rounded-2xl border border-[#DDD0C2] p-6 sm:p-8 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
            {/* Left Column - Image */}
            <div className="w-full">
              <ProductImage imageUrl={product.image_url} alt={product.name} />
            </div>

            {/* Right Column - Info */}
            <div className="flex flex-col justify-center h-full pt-4 lg:pt-0">
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#B28F76] mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="text-3xl font-heading font-bold text-[#B28F76] mb-8">
                R$ {Number(product.price).toFixed(2).replace('.', ',')}
              </div>
              <div className="">
                <AddToCart product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: product.image_url
                }} />
              </div>
            </div>
          </div>

          {/* Full-width Description */}
          {product.description && (
            <div className="pt-8 border-t border-[#DDD0C2]">
              <h3 className="text-xl font-heading font-bold text-[#B28F76] mb-4">Detalhes do Produto</h3>
              <div className="text-[#B28F76]/90 leading-relaxed whitespace-pre-wrap max-w-4xl">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
