'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Campos de endereço
  const zip_code = formData.get('zip_code') as string
  const street = formData.get('street') as string
  const number = formData.get('number') as string
  const complement = formData.get('complement') as string
  const neighborhood = formData.get('neighborhood') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string

  if (!name || !email || !password) {
    return { error: 'Nome, e-mail e senha são obrigatórios.' }
  }

  if (!zip_code || !street || !number || !neighborhood || !city || !state) {
    return { error: 'Por favor, preencha todos os campos obrigatórios do endereço.' }
  }

  const supabase = await createClient()

  // 1. Criar o usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'http://localhost:3000/auth/callback',
      data: {
        name: name,
        full_name: name,
      }
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (authData.user) {
    // 2. Inserir o perfil do usuário na tabela profiles
    // Vamos usar o Admin Client para garantir que não haja bloqueio por RLS (Row Level Security)
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const supabaseAdmin = createAdminClient()
    
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authData.user.id,
        name: name,
        email: email,
        role: 'client', // Default role
      })

    if (profileError) {
      return { error: `Erro ao criar o perfil do usuário: ${profileError.message} (${profileError.code})` }
    }

    // 3. Inserir o endereço do usuário na tabela addresses
    const { error: addressError } = await supabaseAdmin
      .from('addresses')
      .insert({
        user_id: authData.user.id,
        zip_code,
        street,
        number,
        complement: complement || null,
        neighborhood,
        city,
        state,
      })

    if (addressError) {
      // Idealmente reverter a criação do perfil/auth aqui, mas para manter a consistência reportamos o erro
      return { error: `Erro ao salvar o endereço do usuário: ${addressError.message}` }
    }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}
