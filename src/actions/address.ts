'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function addAddress(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Usuário não autenticado' }
  }

  const zip_code = formData.get('zip_code') as string
  const street = formData.get('street') as string
  const number = formData.get('number') as string
  const complement = formData.get('complement') as string
  const neighborhood = formData.get('neighborhood') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string

  if (!zip_code || !street || !number || !neighborhood || !city || !state) {
    return { error: 'Por favor, preencha todos os campos obrigatórios do endereço.' }
  }

  const supabaseAdmin = createAdminClient()

  const { error } = await supabaseAdmin
    .from('addresses')
    .insert({
      user_id: user.id,
      zip_code,
      street,
      number,
      complement: complement || null,
      neighborhood,
      city,
      state,
    })

  if (error) {
    return { error: `Erro ao adicionar endereço: ${error.message}` }
  }

  revalidatePath('/profile')
  revalidatePath('/carrinho')
  return { success: true }
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Usuário não autenticado' }
  }

  const supabaseAdmin = createAdminClient()

  // First check if the address belongs to the user
  const { data: address } = await supabaseAdmin
    .from('addresses')
    .select('user_id')
    .eq('id', addressId)
    .single()

  if (!address || address.user_id !== user.id) {
    return { error: 'Endereço não encontrado ou acesso não autorizado.' }
  }

  const { error } = await supabaseAdmin
    .from('addresses')
    .delete()
    .eq('id', addressId)

  if (error) {
    return { error: `Erro ao remover endereço: ${error.message}` }
  }

  revalidatePath('/profile')
  revalidatePath('/carrinho')
  return { success: true }
}
