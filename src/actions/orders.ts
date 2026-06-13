'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function getFilteredOrdersForExport(query: string) {
  const supabaseAdmin = createAdminClient()

  let queryBuilder = supabaseAdmin
    .from('orders')
    .select(`
      id,
      total_price,
      created_at,
      user:profiles!inner(name)
    `)
    .order('created_at', { ascending: false })

  if (query) {
    queryBuilder = queryBuilder.ilike('user.name', `%${query}%`)
  }

  const { data, error } = await queryBuilder

  if (error) {
    console.error('Erro ao buscar orders via Admin Client:', error)
    return { error: error.message, data: null }
  }

  return { error: null, data }
}
