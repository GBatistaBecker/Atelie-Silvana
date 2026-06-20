import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Header } from '@/components/Header'
import { redirect } from 'next/navigation'
import { ProfileForm } from './ProfileForm'
import { AddressManager } from './AddressManager'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const supabaseAdmin = createAdminClient()

  // Fetch profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const userName = profile?.name || user.user_metadata?.name || ''
  const userEmail = user.email || ''

  // Fetch addresses
  const { data: addresses } = await supabaseAdmin
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#F3EAE5] flex flex-col">
      <Header user={user} activePath="/profile" />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-[#B28F76]">Meu Perfil</h1>
          <p className="text-[#B28F76] mt-2">Gerencie seus dados pessoais e endereços de entrega.</p>
        </div>

        <ProfileForm initialName={userName} initialEmail={userEmail} />
        
        <AddressManager initialAddresses={addresses || []} />
      </main>
    </div>
  )
}
