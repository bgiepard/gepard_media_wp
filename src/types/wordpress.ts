export interface WPPost {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  featured_media: number
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
    }>
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>
    author?: Array<{ name: string }>
  }
}

export interface WPCategory {
  id: number
  name: string
  slug: string
  count: number
}
