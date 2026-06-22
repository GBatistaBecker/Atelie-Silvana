import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cartItems, orderId } = body

    if (!cartItems || !cartItems.length || !orderId) {
      return NextResponse.json({ error: 'Dados insuficientes para o checkout' }, { status: 400 })
    }

    const handle = process.env.NEXT_PUBLIC_INFINITEPAY_HANDLE
    
    const origin = request.headers.get('origin') || 'http://localhost:3000'
    
    if (!handle) {
      console.warn('NEXT_PUBLIC_INFINITEPAY_HANDLE não configurada. Simulando redirecionamento de sucesso.')
      return NextResponse.json({ url: `${origin}/obrigado` })
    }

    // Convert items for InfinitePay: price must be in cents (Math.round to avoid float issues)
    const items = cartItems.map((item: any) => ({
      quantity: item.quantity,
      price: Math.round(item.price * 100),
      description: `${item.name}${item.custom_description ? ` (${item.custom_description})` : ''}`.substring(0, 255)
    }))
    
    const payload = {
      handle: handle,
      redirect_url: `${origin}/obrigado`,
      webhook_url: `${origin}/api/webhook/infinitepay`,
      order_nsu: orderId,
      items: items
    }

    const res = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('InfinitePay API Error:', err)
      return NextResponse.json({ error: 'Erro ao gerar link de pagamento na InfinitePay.' }, { status: res.status })
    }

    const data = await res.json()
    
    if (!data.url) {
      return NextResponse.json({ error: 'A InfinitePay não retornou uma URL válida.' }, { status: 500 })
    }

    return NextResponse.json({ url: data.url })
    
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
