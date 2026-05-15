export interface WCProduct {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  sale_price: string
  description: string
  short_description: string
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
  images: Array<{ src: string; alt: string }>
  categories: Array<{ id: number; name: string; slug: string }>
}
