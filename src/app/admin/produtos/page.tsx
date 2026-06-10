import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { deleteProduct } from '@/actions/products'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-[#B28F76]">Produtos</h2>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 bg-[#B28F76] text-white px-4 py-2 rounded-md hover:bg-[#D2B6A2] transition-colors"
        >
          <Plus size={20} />
          Novo Produto
        </Link>
      </div>

      <div className="bg-[#ECE1D9] rounded-lg shadow border border-[#DDD0C2] overflow-hidden">
        {error ? (
          <div className="p-6 text-red-500">Erro ao carregar produtos: {error.message}</div>
        ) : products && products.length > 0 ? (
          <table className="min-w-full divide-y divide-[#DDD0C2]">
            <thead className="bg-[#F3EAE5]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#B28F76] uppercase tracking-wider">
                  Produto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#B28F76] uppercase tracking-wider">
                  Preço
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#B28F76] uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#DDD0C2]">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 relative rounded-md overflow-hidden bg-gray-100">
                        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/produtos/${product.id}`} className="text-[#B28F76] hover:text-[#D2B6A2]">
                        <Pencil size={20} />
                        <span className="sr-only">Editar</span>
                      </Link>
                      <form action={async () => {
                        'use server'
                        await deleteProduct(product.id)
                      }}>
                        <button type="submit" className="text-red-600 hover:text-red-900">
                          <Trash2 size={20} />
                          <span className="sr-only">Excluir</span>
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-[#B28F76]">
            Nenhum produto cadastrado. Clique em "Novo Produto" para começar.
          </div>
        )}
      </div>
    </div>
  )
}
