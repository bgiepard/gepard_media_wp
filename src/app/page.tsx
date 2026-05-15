import { getPosts } from '@/lib/wordpress'
import Link from 'next/link'

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10">Blog</h1>

      <div className="space-y-10">
        {posts.map((post) => {
          const image = post._embedded?.['wp:featuredmedia']?.[0]

          return (
            <article key={post.id} className="border-b border-gray-200 pb-10">
              {image && (
                <img
                  src={image.source_url}
                  alt={image.alt_text || post.title.rendered}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />
              )}
              <time className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <h2 className="text-2xl font-semibold mt-1 mb-2">
                <Link
                  href={`/posts/${post.slug}`}
                  className="hover:text-blue-600 transition-colors"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
              </h2>
              <div
                className="text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
              <Link
                href={`/posts/${post.slug}`}
                className="inline-block mt-4 text-blue-600 font-medium hover:underline"
              >
                Czytaj dalej →
              </Link>
            </article>
          )
        })}
      </div>
    </main>
  )
}
