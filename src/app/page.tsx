import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { MousePointerClick, Edit3, Truck, Gift } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const adminSupabase = createAdminClient()

  if (user) {
    // Busca a role de forma segura usando o admin client para evitar problemas de RLS
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      redirect('/admin')
    }
  }

  // Fetch 6 featured products
  const { data: featuredProducts } = await adminSupabase
    .from('products')
    .select('*')
    .limit(6)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#F3EAE5] flex flex-col">
      <Header user={user} activePath="/" />

      <main className="flex-1 flex flex-col">
        {/* 1. Hero Banner */}
        <section className="relative w-full py-24 sm:py-32 px-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#ECE1D9] to-[#F3EAE5]">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#B28F76 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-[#B28F76] leading-tight">
              Bordados personalizados feitos com amor e delicadeza
            </h1>
            <p className="text-lg sm:text-xl text-[#B28F76]/80 max-w-2xl mx-auto">
              Transformamos suas ideias em peças únicas para presentear, decorar ou guardar momentos especiais.
            </p>
            <Link
              href="/produtos"
              className="inline-block mt-4 px-8 py-4 bg-[#B28F76] text-white font-medium rounded-md hover:bg-[#D2B6A2] hover:text-[#B28F76] transition-all shadow-md hover:shadow-lg text-lg"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </section>

        {/* 2. Seção de Diferenciais / Especialidades */}
        <section className="w-full py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#ECE1D9] p-8 rounded-2xl shadow-sm border border-[#DDD0C2] hover:border-[#D2B6A2] transition-colors flex flex-col items-center text-center">
              <span className="text-4xl mb-4">🧵</span>
              <h3 className="text-xl font-heading font-bold text-[#B28F76] mb-3">Toalhas Bordadas</h3>
              <p className="text-[#B28F76]/80 text-sm leading-relaxed">Toalhas de banho, rosto e lavabo com brasões e iniciais elegantes.</p>
            </div>
            <div className="bg-[#ECE1D9] p-8 rounded-2xl shadow-sm border border-[#DDD0C2] hover:border-[#D2B6A2] transition-colors flex flex-col items-center text-center">
              <span className="text-4xl mb-4">🎁</span>
              <h3 className="text-xl font-heading font-bold text-[#B28F76] mb-3">Presentes Personalizados</h3>
              <p className="text-[#B28F76]/80 text-sm leading-relaxed">Mimos exclusivos criados sob medida para surpreender quem você ama.</p>
            </div>
            <div className="bg-[#ECE1D9] p-8 rounded-2xl shadow-sm border border-[#DDD0C2] hover:border-[#D2B6A2] transition-colors flex flex-col items-center text-center">
              <span className="text-4xl mb-4">👶</span>
              <h3 className="text-xl font-heading font-bold text-[#B28F76] mb-3">Infantil</h3>
              <p className="text-[#B28F76]/80 text-sm leading-relaxed">Enxovais macios, mantas e sapatinhos delicados para dar as boas-vindas aos bebês.</p>
            </div>
          </div>
        </section>

        {/* 3. Vitrine de Produtos em Destaque */}
        <section className="w-full py-20 bg-[#ECE1D9] border-y border-[#DDD0C2]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
              <h2 className="text-3xl font-heading font-bold text-[#B28F76]">Destaques do Ateliê</h2>
              <Link href="/produtos" className="text-[#B28F76] font-medium hover:text-[#D2B6A2] transition-colors flex items-center gap-1">
                Ver todos os produtos <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            {(!featuredProducts || featuredProducts.length === 0) ? (
              <p className="text-[#B28F76] text-center">Nenhum produto em destaque no momento.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map(product => (
                  <Link href={`/produtos/${product.id}`} key={product.id} className="group bg-[#F3EAE5] rounded-xl overflow-hidden border border-[#DDD0C2] hover:border-[#D2B6A2] transition-colors shadow-sm flex flex-col h-full">
                    <div className="relative aspect-square w-full bg-[#ECE1D9]">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[#B28F76]/50">
                          Sem imagem
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-heading font-bold text-lg text-[#B28F76] mb-4 line-clamp-2">{product.name}</h3>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-heading font-bold text-[#B28F76] text-xl">R$ {Number(product.price).toFixed(2).replace('.', ',')}</span>
                        <span className="text-sm font-medium text-[#B28F76] bg-[#DDD0C2]/50 px-4 py-1.5 rounded-full group-hover:bg-[#D2B6A2] group-hover:text-white transition-colors">Detalhes</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. Seção "Como Funciona" */}
        <section className="w-full py-24 px-6 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-[#B28F76] mb-16">Como funciona a personalização?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-[#DDD0C2] -z-10"></div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#ECE1D9] border border-[#DDD0C2] flex items-center justify-center mb-6 shadow-sm">
                <MousePointerClick className="w-8 h-8 text-[#B28F76]" />
              </div>
              <h3 className="text-xl font-heading font-bold text-[#B28F76] mb-3">1. Escolha um modelo</h3>
              <p className="text-[#B28F76]/80 text-sm leading-relaxed max-w-xs">Navegue por nossa vitrine ou catálogo e selecione a peça que mais combina com seu momento.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#ECE1D9] border border-[#DDD0C2] flex items-center justify-center mb-6 shadow-sm">
                <Edit3 className="w-8 h-8 text-[#B28F76]" />
              </div>
              <h3 className="text-xl font-heading font-bold text-[#B28F76] mb-3">2. Descreva sua personalização</h3>
              <p className="text-[#B28F76]/80 text-sm leading-relaxed max-w-xs">Na página do produto, use a nossa caixa de texto para ditar nomes, cores e detalhes do bordado.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#ECE1D9] border border-[#DDD0C2] flex items-center justify-center mb-6 shadow-sm">
                <Truck className="w-8 h-8 text-[#B28F76]" />
              </div>
              <h3 className="text-xl font-heading font-bold text-[#B28F76] mb-3">3. Receba em casa</h3>
              <p className="text-[#B28F76]/80 text-sm leading-relaxed max-w-xs">Nós preparamos sua encomenda com todo o zelo do mundo e enviamos diretamente para o seu endereço.</p>
            </div>
          </div>
        </section>

        {/* 5. Seção "Sobre a Artesã" */}
        <section className="w-full bg-[#ECE1D9] border-t border-[#DDD0C2]">
          <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-xl border-4 border-[#F3EAE5]">
                <Image
                  src="/img/silvana.jpeg"
                  alt="Silvana Becker - Artesã"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 16rem, (max-width: 1024px) 20rem, 24rem"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col space-y-6 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#B28F76]">Olá! Sou a Silvana Becker</h2>
              <div className="space-y-4 text-[#B28F76]/90 text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
                <p>
                  Minha paixão é transformar linhas em memórias afetivas. No meu ateliê em Tubarão/SC, cada ponto é planejado com muito amor, delicadeza e dedicação.
                </p>
                <p>
                  Especialista em <strong className="font-bold text-[#B28F76]">bordados computadorizados</strong>, utilizo maquinário de alta precisão e fios premium para garantir que cada detalhe do seu desenho ou texto seja reproduzido com perfeição milimétrica sobre tecidos de altíssima qualidade. Seu sonho é desenhado no computador e eternizado na agulha com o carinho de um produto feito sob encomenda.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
