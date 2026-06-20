'use client'

import { useState, useMemo } from 'react'
import { Calendar, Package, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface OrdersClientProps {
  initialOrders: any[]
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc')
  const [priceSort, setPriceSort] = useState<'none' | 'desc' | 'asc'>('none')

  const sortedOrders = useMemo(() => {
    let sorted = [...initialOrders]

    // Sort by price if a price sort is selected
    if (priceSort !== 'none') {
      sorted.sort((a, b) => {
        if (priceSort === 'desc') {
          return b.total_price - a.total_price
        } else {
          return a.total_price - b.total_price
        }
      })
    } else {
      // Otherwise, sort by date
      sorted.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        if (dateSort === 'desc') {
          return dateB - dateA
        } else {
          return dateA - dateB
        }
      })
    }

    return sorted
  }, [initialOrders, dateSort, priceSort])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'pago': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'enviado': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'entregue': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (initialOrders.length === 0) {
    return (
      <div className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-xl p-8 text-center shadow-sm">
        <Package className="mx-auto h-12 w-12 text-[#B28F76] opacity-50 mb-4" />
        <h2 className="text-xl font-heading font-bold text-[#B28F76] mb-2">Nenhum pedido encontrado</h2>
        <p className="text-[#B28F76] mb-6">Você ainda não realizou nenhuma encomenda. Que tal dar uma olhada no nosso catálogo?</p>
        <Link 
          href="/produtos"
          className="inline-flex items-center justify-center bg-[#B28F76] text-white px-6 py-2 rounded-md font-medium hover:bg-[#D2B6A2] transition-colors"
        >
          Ver Produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Barra de Filtros */}
      <div className="bg-[#ECE1D9] border border-[#DDD0C2] p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="text-[#B28F76] font-medium">
          {initialOrders.length} {initialOrders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select 
            className="rounded-md border-0 py-2 pl-3 pr-8 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] focus:ring-2 focus:ring-inset focus:ring-[#B28F76] bg-[#F3EAE5] sm:text-sm"
            value={dateSort}
            onChange={(e) => {
              setDateSort(e.target.value as 'desc' | 'asc')
              setPriceSort('none')
            }}
          >
            <option value="desc">Mais recentes</option>
            <option value="asc">Mais antigos</option>
          </select>
          <select 
            className="rounded-md border-0 py-2 pl-3 pr-8 text-[#B28F76] ring-1 ring-inset ring-[#DDD0C2] focus:ring-2 focus:ring-inset focus:ring-[#B28F76] bg-[#F3EAE5] sm:text-sm"
            value={priceSort}
            onChange={(e) => {
              setPriceSort(e.target.value as 'none' | 'desc' | 'asc')
            }}
          >
            <option value="none">Ordenar por Preço</option>
            <option value="desc">Maior valor</option>
            <option value="asc">Menor valor</option>
          </select>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {sortedOrders.map((order) => {
          const date = new Date(order.created_at)
          const formattedDate = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).format(date)

          return (
            <div key={order.id} className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-xl overflow-hidden shadow-sm">
              {/* Header do Card */}
              <div className="bg-[#F3EAE5] p-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#DDD0C2]">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-[#B28F76]">
                    <Package size={18} />
                    <span className="font-medium text-sm">#{order.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#B28F76]">
                    <Calendar size={18} />
                    <span className="text-sm">{formattedDate}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#B28F76]">
                  <DollarSign size={18} />
                  <span className="font-bold text-lg">{formatCurrency(order.total_price)}</span>
                </div>
              </div>
              
              {/* Corpo do Card (Itens) */}
              <div className="p-4 sm:px-6">
                <h4 className="text-sm font-bold text-[#B28F76] mb-3 uppercase tracking-wider">Itens do Pedido</h4>
                <div className="divide-y divide-[#DDD0C2]">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-[#B28F76]">
                          {item.quantity}x {item.product?.name || 'Produto indisponível'}
                        </p>
                        {item.custom_description && (
                          <p className="text-sm text-[#B28F76]/80 mt-1 italic">
                            Bordado: "{item.custom_description}"
                          </p>
                        )}
                      </div>
                      <div className="text-[#B28F76] font-medium whitespace-nowrap">
                        {formatCurrency(item.price_at_purchase * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
