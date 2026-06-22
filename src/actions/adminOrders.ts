'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Não autenticado' }
    }

    // Verificar se o usuário é admin
    const adminSupabase = createAdminClient()
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Acesso negado' }
    }

    const validStatuses = ['pending', 'sent', 'received', 'paid', 'canceled']
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: 'Status inválido' }
    }

    const { error } = await adminSupabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      console.error('Update status error:', error)
      return { success: false, error: 'Erro ao atualizar o pedido' }
    }

    revalidatePath('/admin/pedidos-pendentes')
    revalidatePath('/profile/orders')

    return { success: true }
  } catch (err) {
    console.error(err)
    return { success: false, error: 'Erro inesperado ao atualizar status' }
  }
}
