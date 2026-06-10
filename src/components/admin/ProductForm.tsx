'use client'

import { useState, useRef, useTransition } from 'react'
import Image from 'next/image'

type ProductFormProps = {
  initialData?: {
    id: string
    name: string
    description: string | null
    price: number
    image_url: string
  }
  action: (formData: FormData) => Promise<{ error?: string } | void>
}

export function ProductForm({ initialData, action }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState<string | null>(initialData?.image_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#ECE1D9] p-6 rounded-lg border border-[#DDD0C2]">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#B28F76]">
              Nome do Produto
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={initialData?.name}
              className="mt-1 block w-full rounded-md border border-[#DDD0C2] bg-[#F3EAE5] px-3 py-2 text-[#B28F76] shadow-sm focus:border-[#B28F76] focus:outline-none focus:ring-1 focus:ring-[#B28F76]"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-[#B28F76]">
              Preço (R$)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              step="0.01"
              min="0"
              defaultValue={initialData?.price}
              className="mt-1 block w-full rounded-md border border-[#DDD0C2] bg-[#F3EAE5] px-3 py-2 text-[#B28F76] shadow-sm focus:border-[#B28F76] focus:outline-none focus:ring-1 focus:ring-[#B28F76]"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#B28F76]">
              Descrição (Opcional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={initialData?.description || ''}
              className="mt-1 block w-full rounded-md border border-[#DDD0C2] bg-[#F3EAE5] px-3 py-2 text-[#B28F76] shadow-sm focus:border-[#B28F76] focus:outline-none focus:ring-1 focus:ring-[#B28F76]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#B28F76] mb-2">
            Imagem do Produto
          </label>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#DDD0C2] rounded-md p-6 bg-[#F3EAE5]">
            {preview ? (
              <div className="relative w-full aspect-square mb-4">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="w-full aspect-square bg-[#ECE1D9] flex items-center justify-center text-[#D2B6A2] mb-4 rounded-md">
                Sem Imagem
              </div>
            )}
            
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
              required={!initialData} // Required if creating new
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white text-[#B28F76] text-sm font-medium rounded-md border border-[#DDD0C2] hover:bg-gray-50 focus:outline-none"
            >
              {preview ? 'Trocar Imagem' : 'Selecionar Imagem'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-[#DDD0C2]">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-[#B28F76] text-white font-medium rounded-md hover:bg-[#D2B6A2] focus:outline-none disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Salvando...' : 'Salvar Produto'}
        </button>
      </div>
    </form>
  )
}
