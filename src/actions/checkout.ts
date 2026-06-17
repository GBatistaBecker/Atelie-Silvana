'use server'

import { createClient } from '@/lib/supabase/server'
import { CartItem } from '@/contexts/CartContext'

export async function checkout(cartItems: CartItem[], addressId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    if (!cartItems.length) {
      return { success: false, error: 'O carrinho está vazio' }
    }

    if (!addressId) {
      return { success: false, error: 'Endereço não selecionado' }
    }

    // Securely fetch prices from the DB
    const productIds = cartItems.map(item => item.product_id)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, price')
      .in('id', productIds)

    if (productsError || !products) {
      return { success: false, error: 'Erro ao buscar dados dos produtos.' }
    }

    // Calculate total secure price
    let secureTotalPrice = 0
    const orderItemsToInsert = []

    for (const item of cartItems) {
      const dbProduct = products.find(p => p.id === item.product_id)
      if (!dbProduct) {
        return { success: false, error: `Produto não encontrado: ${item.name}` }
      }

      secureTotalPrice += dbProduct.price * item.quantity

      orderItemsToInsert.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: dbProduct.price,
        custom_description: item.custom_description || null
      })
    }

    // Insert into orders
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        address_id: addressId,
        total_price: secureTotalPrice,
        status: 'pending'
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error(orderError)
      return { success: false, error: 'Erro ao criar o pedido.' }
    }

    // Insert into order_items
    const finalOrderItems = orderItemsToInsert.map(oi => ({
      ...oi,
      order_id: order.id
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(finalOrderItems)

    if (itemsError) {
      console.error(itemsError)
      // Ideally we should rollback or have a transaction here, but since Supabase REST doesn't support generic transactions yet,
      // we log the error. We can also delete the order.
      await supabase.from('orders').delete().eq('id', order.id)
      return { success: false, error: 'Erro ao salvar os itens do pedido.' }
    }

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Checkout error:', error)
    return { success: false, error: 'Ocorreu um erro inesperado durante o checkout.' }
  }
}
