import { WCProduct } from '@/types/woocommerce'

const WC_URL = `${process.env.WP_API_URL!.replace('/wp/v2', '')}/wc/v3`

const auth = Buffer.from(
  `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
).toString('base64')

async function fetchWC<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${WC_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: options.method ? undefined : { revalidate: 60 },
  })

  if (!res.ok) throw new Error(`WC API error: ${res.status} ${path}`)

  return res.json()
}

export interface WCBilling {
  first_name: string
  last_name: string
  email: string
  address_1: string
  city: string
  postcode: string
  country: string
}

export interface WCOrderItem {
  product_id: number
  quantity: number
}

export async function createOrder(billing: WCBilling, lineItems: WCOrderItem[]) {
  return fetchWC<{ id: number }>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      payment_method: 'stripe',
      payment_method_title: 'Karta kredytowa',
      status: 'pending',
      billing,
      shipping: billing,
      line_items: lineItems,
    }),
  })
}

export async function updateOrderStatus(orderId: number, status: string) {
  return fetchWC(`/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

export async function getProducts(perPage = 12): Promise<WCProduct[]> {
  return fetchWC(`/products?per_page=${perPage}&status=publish`)
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const products = await fetchWC<WCProduct[]>(`/products?slug=${slug}`)
  return products[0] ?? null
}
