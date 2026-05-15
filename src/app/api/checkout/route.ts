import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createOrder, WCBilling, WCOrderItem } from '@/lib/woocommerce'
import { CartItem } from '@/context/CartContext'

export async function POST(req: NextRequest) {
  const { items, billing }: { items: CartItem[]; billing: WCBilling } = await req.json()

  if (!items?.length) {
    return NextResponse.json({ error: 'Koszyk jest pusty' }, { status: 400 })
  }

  const lineItems: WCOrderItem[] = items.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
  }))

  const order = await createOrder(billing, lineItems)

  const totalGrosze = Math.round(
    items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0) * 100
  )

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalGrosze,
    currency: 'pln',
    metadata: { wc_order_id: String(order.id) },
  })

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
  })
}
