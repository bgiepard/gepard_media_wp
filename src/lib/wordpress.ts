import { WPPost, WPCategory } from '@/types/wordpress'

const API_URL = process.env.WP_API_URL!

async function fetchWP<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) throw new Error(`WP API error: ${res.status} ${path}`)

  return res.json()
}

export async function getPosts(page = 1, perPage = 10): Promise<WPPost[]> {
  return fetchWP(`/posts?_embed&page=${page}&per_page=${perPage}`)
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const posts = await fetchWP<WPPost[]>(`/posts?_embed&slug=${slug}`)
  return posts[0] ?? null
}

export async function getCategories(): Promise<WPCategory[]> {
  return fetchWP('/categories?per_page=100')
}
