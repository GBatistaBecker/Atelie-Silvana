'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateEmail(newEmail: string) {
  const supabase = await createClient()

  // First verify user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Usuário não autenticado' }
  }

  // Update email using supabase auth
  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  })

  if (error) {
    return { error: error.message }
  }

  // Update the email in profiles table as well just to keep it in sync
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const supabaseAdmin = createAdminClient()
  
  await supabaseAdmin
    .from('profiles')
    .update({ email: newEmail })
    .eq('id', user.id)

  revalidatePath('/profile')
  return { success: true }
}
