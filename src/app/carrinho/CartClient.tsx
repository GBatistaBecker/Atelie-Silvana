'use client'

import { useCart } from '@/contexts/CartContext'
import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus, Loader2 } from 'lucide-react'
import { checkout } from '@/actions/checkout'
import { useRouter } from 'next/navigation'

interface CartClientProps {
  addresses: any[]
}

export function CartClient({ addresses }: CartClientProps) {
  const { cartItems, removeFromCart, updateQuantity, updateCustomDescription, clearCart, totalItems } = useCart()
  const [selectedAddressId, setSelectedAddressId] = useState(addresses.length > 0 ? addresses[0].id : '')
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const handleCheckout = () => {
    setErrorMsg('')
    if (!selectedAddressId) {
      setErrorMsg('Por favor, selecione ou cadastre um endereço de entrega.')
      return
    }

    startTransition(async () => {
      // 1. Salvar no banco e gerar o pedido
      const res = await checkout(cartItems, selectedAddressId)
      
      if (!res.success || !res.orderId) {
        setErrorMsg(res.error || 'Erro ao processar o pedido.')
        return
      }

      // 2. Chamar a API da InfinitePay
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems,
            orderId: res.orderId
          })
        })

        const data = await response.json()

        if (!response.ok || data.error) {
          setErrorMsg(data.error || 'Erro ao gerar link de pagamento.')
          return
        }

        if (data.url) {
          clearCart()
          // Redireciona o usuário para o link da InfinitePay (ou fallback de obrigado)
          window.location.href = data.url
        } else {
          setErrorMsg('URL de pagamento inválida.')
        }
      } catch (err) {
        console.error('Checkout fetch error:', err)
        setErrorMsg('Erro de conexão ao gerar link de pagamento.')
      }
    })
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#ECE1D9] p-12 rounded-xl border border-[#DDD0C2] text-center shadow-sm">
        <p className="text-lg text-[#B28F76] mb-6">Seu carrinho está vazio.</p>
        <Link 
          href="/produtos" 
          className="inline-flex px-6 py-3 bg-[#B28F76] text-[#F3EAE5] font-medium rounded-md hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-colors shadow-sm"
        >
          Continuar Comprando
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Lista de Itens */}
      <div className="flex-1 flex flex-col gap-6 w-full">
        {cartItems.map((item, idx) => (
          <div key={`${item.product_id}-${idx}`} className="bg-[#ECE1D9] p-4 sm:p-6 rounded-2xl border border-[#DDD0C2] shadow-sm flex flex-col sm:flex-row gap-6">
            {/* Image */}
            <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0 border border-[#DDD0C2]">
              <Image 
                src={item.image_url} 
                alt={item.name} 
                fill 
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 128px"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-heading font-bold text-[#B28F76] leading-tight">{item.name}</h3>
                  <p className="text-[#B28F76] font-medium mt-1">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.product_id, item.custom_description)}
                  className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
                  title="Remover item"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Quantidade */}
              <div className="flex items-center gap-3 bg-[#F3EAE5] w-fit rounded-lg border border-[#DDD0C2] p-1">
                <button 
                  onClick={() => updateQuantity(item.product_id, item.custom_description, item.quantity - 1)}
                  className="p-1 text-[#B28F76] hover:bg-[#ECE1D9] rounded-md transition-colors disabled:opacity-50"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-bold text-[#B28F76] text-sm">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.product_id, item.custom_description, item.quantity + 1)}
                  className="p-1 text-[#B28F76] hover:bg-[#ECE1D9] rounded-md transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Personalização */}
              <div className="w-full">
                <label className="text-sm font-bold text-[#B28F76] mb-1 block">Sua personalização:</label>
                <textarea
                  rows={2}
                  className="w-full bg-[#F3EAE5] text-[#B28F76] text-sm border border-[#DDD0C2] rounded-lg p-3 focus:outline-none focus:border-[#B28F76] focus:ring-1 focus:ring-[#B28F76] transition-colors resize-none"
                  placeholder="Sem personalização informada. Adicione aqui os detalhes..."
                  value={item.custom_description || ''}
                  onChange={(e) => updateCustomDescription(item.product_id, item.custom_description, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo e Checkout */}
      <div className="w-full lg:w-96 bg-[#ECE1D9] p-6 sm:p-8 rounded-2xl border border-[#DDD0C2] shadow-sm sticky top-6">
        <h2 className="text-2xl font-heading font-bold text-[#B28F76] mb-6">Resumo</h2>
        
        <div className="flex justify-between items-center mb-4 text-[#B28F76]">
          <span>Subtotal ({totalItems} itens)</span>
          <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
        </div>
        
        <div className="flex justify-between items-center font-bold text-xl text-[#B28F76] py-4 border-t border-[#DDD0C2] mb-6">
          <span>Total</span>
          <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
        </div>

        {/* Endereço */}
        <div className="mb-8">
          <label className="font-heading font-bold text-[#B28F76] mb-2 block">Endereço de Entrega</label>
          {addresses.length > 0 ? (
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
              className="w-full bg-[#F3EAE5] text-[#B28F76] border border-[#DDD0C2] rounded-xl p-3 focus:outline-none focus:border-[#B28F76] transition-colors"
            >
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.street}, {addr.number} {addr.complement && `- ${addr.complement}`} - {addr.city}/{addr.state}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm text-[#B28F76] bg-[#F3EAE5] p-3 rounded-lg border border-red-200">
              <p>Você não possui nenhum endereço cadastrado.</p>
              <Link href="/profile/addresses" className="text-red-500 hover:underline mt-1 inline-block">
                Cadastre um endereço
              </Link>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mb-4 text-sm font-medium text-red-500 bg-red-50 border border-red-200 p-3 rounded-lg">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={isPending || addresses.length === 0}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#B28F76] text-[#F3EAE5] font-bold text-lg rounded-xl hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processando...
            </>
          ) : (
            'Confirmar Pedido'
          )}
        </button>
      </div>
    </div>
  )
}
