import { getPosts } from '@/lib/wordpress'
import PostsSlider from '@/components/PostsSlider'
import Link from 'next/link'

export default async function HomePage() {
  const posts = await getPosts(1, 10)
  const sliderPosts = posts.slice(0, 5)
  const listPosts = posts.slice(5)

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <PostsSlider posts={sliderPosts} />

      {listPosts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Więcej artykułów</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listPosts.map((post) => {
              const image = post._embedded?.['wp:featuredmedia']?.[0]
              return (
                <article key={post.id} className="group flex flex-col">
                  <div className="overflow-hidden rounded-xl bg-gray-100 mb-4 h-48">
                    {image ? (
                      <img
                        src={image.source_url}
                        alt={image.alt_text || post.title.rendered}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-gray-200" />
                    )}
                  </div>
                  <time className="text-xs text-gray-400 mb-1">
                    {new Date(post.date).toLocaleDateString('pl-PL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                  <h3 className="font-semibold text-lg mb-2 leading-snug">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </h3>
                  <div
                    className="text-gray-500 text-sm line-clamp-2 flex-1"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                  <Link
                    href={`/posts/${post.slug}`}
                    className="mt-4 text-blue-600 text-sm font-medium hover:underline"
                  >
                    Czytaj dalej →
                  </Link>
                </article>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
