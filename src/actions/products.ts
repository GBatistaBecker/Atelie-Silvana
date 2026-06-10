'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const file = formData.get('image') as File

  if (!name || isNaN(price) || !file || file.size === 0) {
    return { error: 'Nome, preço válido e imagem são obrigatórios.' }
  }

  // Upload imagem
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file)

  if (uploadError) {
    return { error: 'Erro ao fazer upload da imagem: ' + uploadError.message }
  }

  const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)

  // Insert
  const { error: insertError } = await supabase.from('products').insert([
    {
      name,
      description,
      price,
      image_url: publicUrl,
    },
  ])

  if (insertError) {
    return { error: 'Erro ao criar produto: ' + insertError.message }
  }

  revalidatePath('/admin/produtos')
  redirect('/admin/produtos')
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const file = formData.get('image') as File | null

  if (!name || isNaN(price)) {
    return { error: 'Nome e preço válido são obrigatórios.' }
  }

  const updates: any = {
    name,
    description,
    price,
  }

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file)

    if (uploadError) {
      return { error: 'Erro ao fazer upload da nova imagem: ' + uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)
    updates.image_url = publicUrl
  }

  const { error: updateError } = await supabase.from('products').update(updates).eq('id', id)

  if (updateError) {
    return { error: 'Erro ao atualizar produto: ' + updateError.message }
  }

  revalidatePath('/admin/produtos')
  redirect('/admin/produtos')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    return { error: 'Erro ao excluir produto: ' + error.message }
  }

  revalidatePath('/admin/produtos')
}
