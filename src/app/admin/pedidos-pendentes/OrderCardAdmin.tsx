'use client'

import { useState, useTransition } from 'react'
import { Package, Truck, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { updateOrderStatus } from '@/actions/adminOrders'

export function OrderCardAdmin({ order }: { order: any }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatus(order.id, newStatus)
    })
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-[#DDD0C2] text-[#B28F76]'
      case 'paid':
        return 'bg-blue-100 text-blue-700'
      case 'sent':
        return 'bg-purple-100 text-purple-700'
      case 'received':
        return 'bg-green-100 text-green-700'
      case 'canceled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const translateStatus = (status: string) => {
    switch(status) {
      case 'pending': return 'Pendente'
      case 'paid': return 'Pago'
      case 'sent': return 'Enviado'
      case 'received': return 'Entregue'
      case 'canceled': return 'Cancelado'
      default: return status
    }
  }

  return (
    <div className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-lg p-6 shadow-sm flex flex-col gap-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-sm text-[#B28F76] mb-1 font-semibold">ID do Pedido: <span className="font-normal opacity-80">{order.id}</span></p>
          <p className="text-lg font-heading text-[#B28F76]">Cliente: {order.user?.name || 'Cliente Desconhecido'} ({order.user?.email})</p>
          <p className="text-sm text-[#B28F76] mt-1">
            Data: {new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR')}
          </p>
          <p className="text-sm font-semibold text-[#B28F76] mt-2">
            Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_price)}
          </p>
          <span className={`inline-block mt-3 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${getStatusColor(order.status)}`}>
            {translateStatus(order.status)}
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <select 
              className="px-4 py-2 bg-[#F3EAE5] border border-[#B28F76] text-[#B28F76] rounded outline-none focus:ring-1 focus:ring-[#B28F76] disabled:opacity-50 text-sm font-semibold"
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isPending}
            >
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
              <option value="sent">Enviado</option>
              <option value="received">Entregue</option>
              <option value="canceled">Cancelado</option>
            </select>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#B28F76] text-[#F3EAE5] rounded hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-colors w-full md:w-48 text-sm font-semibold"
          >
            {isExpanded ? (
              <><ChevronUp size={16} /> Ocultar Detalhes</>
            ) : (
              <><ChevronDown size={16} /> Ver Detalhes</>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-[#DDD0C2] pt-6 mt-2">
          <h4 className="font-heading font-bold text-[#B28F76] mb-4">Itens do Pedido</h4>
          <div className="space-y-4">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="bg-[#F3EAE5] p-4 rounded-md border border-[#DDD0C2]">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-[#B28F76]">{item.product?.name}</span>
                  <span className="text-sm font-medium bg-[#ECE1D9] px-2 py-1 rounded text-[#B28F76]">
                    Qtd: {item.quantity}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#B28F76] uppercase">Personalização Solicitada:</span>
                  <p className="text-[#B28F76]/90 text-sm mt-1 bg-white p-3 rounded border border-[#DDD0C2] whitespace-pre-wrap">
                    {item.custom_description || 'Nenhuma personalização informada pelo cliente.'}
                  </p>
                </div>
              </div>
            ))}
            
            {(!order.order_items || order.order_items.length === 0) && (
              <p className="text-sm text-[#B28F76]/80">Nenhum item encontrado.</p>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
