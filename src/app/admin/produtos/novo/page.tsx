import { ProductForm } from '@/components/admin/ProductForm'
import { createProduct } from '@/actions/products'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/produtos" className="inline-flex items-center text-[#B28F76] hover:text-[#D2B6A2] gap-2 mb-4">
          <ArrowLeft size={20} />
          Voltar para lista
        </Link>
        <h2 className="text-3xl font-heading font-bold text-[#B28F76]">Novo Produto</h2>
      </div>

      <ProductForm action={createProduct} />
    </div>
  )
}
