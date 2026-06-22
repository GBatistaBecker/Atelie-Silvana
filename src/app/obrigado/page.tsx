import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CheckCircle, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ObrigadoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#F3EAE5] flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-[#ECE1D9] border border-[#DDD0C2] rounded-3xl p-10 sm:p-16 shadow-sm w-full max-w-2xl">
          <div className="w-24 h-24 bg-[#E5D7CC] rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <CheckCircle className="w-12 h-12 text-[#B28F76]" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#B28F76] mb-6">
            Pedido Recebido!
          </h1>
          
          <p className="text-[#B28F76]/90 text-lg mb-4">
            Muito obrigado por apoiar o nosso ateliê!
          </p>
          <p className="text-[#B28F76]/80 text-base mb-12 max-w-md mx-auto">
            Sua encomenda foi registrada com sucesso e em breve começaremos a trabalhar na sua personalização com todo o carinho e dedicação.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/profile/orders" 
              className="w-full sm:w-auto px-6 py-3 border border-[#B28F76] text-[#B28F76] font-medium rounded-md hover:bg-[#DDD0C2] transition-colors"
            >
              Acompanhar Pedido
            </Link>
            <Link 
              href="/produtos" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#B28F76] text-white font-medium rounded-md hover:bg-[#D2B6A2] transition-colors shadow-sm"
            >
              <ArrowLeft size={18} />
              Voltar ao Catálogo
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
