import { ProductForm } from '@/components/admin/ProductForm'
import { updateProduct } from '@/actions/products'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !product) {
    notFound()
  }

  // Bind the product ID to the update action
  const updateProductWithId = updateProduct.bind(null, product.id)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/produtos" className="inline-flex items-center text-[#B28F76] hover:text-[#D2B6A2] gap-2 mb-4">
          <ArrowLeft size={20} />
          Voltar para lista
        </Link>
        <h2 className="text-3xl font-heading font-bold text-[#B28F76]">Editar Produto</h2>
      </div>

      <ProductForm initialData={product} action={updateProductWithId} />
    </div>
  )
}
