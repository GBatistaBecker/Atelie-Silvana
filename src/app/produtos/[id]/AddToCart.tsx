'use client'

import { useState } from 'react'
import { ShoppingBag, Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AddToCartProps {
  productId: string
}

export function AddToCart({ productId }: AddToCartProps) {
  const [customDescription, setCustomDescription] = useState('')
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()

  const handleAddToCart = () => {
    const params = new URLSearchParams()
    params.set('productId', productId)
    params.set('quantity', quantity.toString())
    if (customDescription.trim()) {
      params.set('custom_description', customDescription.trim())
    }
    
    router.push(`/cart?${params.toString()}`)
  }

  const decrement = () => setQuantity(q => Math.max(1, q - 1))
  const increment = () => setQuantity(q => q + 1)

  return (
    <div className="flex flex-col gap-6">
      {/* Quantidade */}
      <div className="flex flex-col gap-2">
        <label className="font-heading font-bold text-[#B28F76]">Quantidade</label>
        <div className="flex items-center gap-4 bg-[#F3EAE5] w-fit rounded-lg border border-[#DDD0C2] p-1 shadow-sm">
          <button 
            onClick={decrement}
            className="p-2 text-[#B28F76] hover:bg-[#ECE1D9] rounded-md transition-colors disabled:opacity-50"
            disabled={quantity <= 1}
            aria-label="Diminuir quantidade"
          >
            <Minus size={18} />
          </button>
          <span className="w-8 text-center font-bold text-[#B28F76]">{quantity}</span>
          <button 
            onClick={increment}
            className="p-2 text-[#B28F76] hover:bg-[#ECE1D9] rounded-md transition-colors"
            aria-label="Aumentar quantidade"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Personalização */}
      <div className="flex flex-col gap-2">
        <label htmlFor="custom_description" className="font-heading font-bold text-[#B28F76]">
          Personalize seu produto (Opcional)
        </label>
        <textarea
          id="custom_description"
          name="custom_description"
          rows={3}
          className="w-full bg-[#F3EAE5] text-[#B28F76] border border-[#DDD0C2] rounded-xl p-4 focus:outline-none focus:border-[#B28F76] focus:ring-1 focus:ring-[#B28F76] transition-colors shadow-sm placeholder:text-[#B28F76]/50 resize-none"
          placeholder="Ex: Gostaria do produto na cor azul-bebê com o nome 'Arthur' bordado em linha dourada..."
          value={customDescription}
          onChange={(e) => setCustomDescription(e.target.value)}
        />
        <p className="text-xs text-[#B28F76]/70 mt-1">
          Nota: O trabalho é totalmente artesanal e feito sob encomenda. Descreva os detalhes com clareza.
        </p>
      </div>
      
      {/* Botão Adicionar */}
      <button 
        onClick={handleAddToCart}
        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 mt-2 bg-[#B28F76] text-[#F3EAE5] text-lg font-bold rounded-xl hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-all hover:shadow-md active:scale-[0.98]"
      >
        <ShoppingBag size={24} />
        Adicionar ao Carrinho
      </button>
    </div>
  )
}
