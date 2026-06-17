'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export function CartBadge() {
  const { totalItems } = useCart()

  return (
    <Link 
      href="/carrinho" 
      className="relative p-2 text-[#B28F76] hover:bg-[#DDD0C2] rounded-full transition-colors flex items-center justify-center"
      aria-label="Carrinho de compras"
    >
      <ShoppingCart size={24} />
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-[#F3EAE5] bg-[#B28F76] rounded-full translate-x-1/4 -translate-y-1/4">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
