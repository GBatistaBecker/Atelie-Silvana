import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Nenhuma pergunta enviada.' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set')
      return NextResponse.json({ error: 'Configuração do assistente incompleta.' }, { status: 500 })
    }

    // Buscar dados do banco
    const adminSupabase = createAdminClient()
    
    // Para performance e escopo desta task, pegaremos a lista de todos os pedidos
    const { data: orders, error: ordersError } = await adminSupabase
      .from('orders')
      .select('status, total_price, created_at')

    if (ordersError) {
      console.error('Erro ao buscar pedidos:', ordersError)
      return NextResponse.json({ error: 'Erro ao coletar dados do sistema.' }, { status: 500 })
    }

    // Processar métricas
    const totalOrders = orders.length
    let totalRevenue = 0
    let pendingCount = 0
    let paidCount = 0
    let sentCount = 0
    let receivedCount = 0
    let canceledCount = 0
    let last30DaysCount = 0

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    orders.forEach(order => {
      // Contagem de status
      switch(order.status) {
        case 'pending': pendingCount++; break;
        case 'paid': paidCount++; break;
        case 'sent': sentCount++; break;
        case 'received': receivedCount++; break;
        case 'canceled': canceledCount++; break;
      }

      // Faturamento (apenas não cancelados e não pendentes, ou apenas pago/enviado/entregue)
      // Vamos assumir faturamento como a soma dos pedidos válidos (paid, sent, received)
      if (['paid', 'sent', 'received'].includes(order.status)) {
        totalRevenue += order.total_price
      }

      // Últimos 30 dias
      const orderDate = new Date(order.created_at)
      if (orderDate >= thirtyDaysAgo) {
        last30DaysCount++
      }
    })

    const atelieDataJSON = JSON.stringify({
      resumo_geral: {
        total_de_pedidos_registrados: totalOrders,
        faturamento_bruto_confirmado_reais: totalRevenue,
        pedidos_ultimos_30_dias: last30DaysCount
      },
      pedidos_por_status: {
        pendentes: pendingCount,
        pagos: paidCount,
        enviados: sentCount,
        entregues: receivedCount,
        cancelados: canceledCount
      }
    })

    // Integrar com Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const systemPrompt = `Você é o assistente virtual de gestão do Ateliê de bordados da Silvana. Seu papel é responder às perguntas dela de forma educada, direta, útil e amigável.
Baseie suas respostas ESTRITAMENTE nos seguintes dados atuais do sistema do Ateliê (não invente informações): 
${atelieDataJSON}

A pergunta da Silvana é: ${prompt}`

    const result = await model.generateContent(systemPrompt)
    const responseText = result.response.text()

    return NextResponse.json({ reply: responseText })
    
  } catch (error) {
    console.error('Erro na API do Assistente:', error)
    return NextResponse.json({ error: 'Erro interno no servidor ao se comunicar com a IA.' }, { status: 500 })
  }
}
