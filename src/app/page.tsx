import { getPosts } from '@/lib/wordpress'
import PostsSlider from '@/components/PostsSlider'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
  const posts = await getPosts(1, 10)
  const sliderPosts = posts.slice(0, 5)
  const listPosts = posts.slice(5)

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <PostsSlider posts={sliderPosts} />

      {listPosts.length > 0 && (
        <section className="mt-20">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-2xl font-bold tracking-tight">Więcej artykułów</h2>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Wszystkie →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listPosts.map((post) => {
              const image = post._embedded?.['wp:featuredmedia']?.[0]
              const category = post._embedded?.['wp:term']?.[0]?.[0]

              return (
                <Card key={post.id} className="group overflow-hidden border-border/60 hover:border-border hover:shadow-md transition-all duration-300 py-0 gap-0">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {image ? (
                      <Image
                        src={image.source_url}
                        alt={image.alt_text || post.title.rendered}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                    )}
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {category && (
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {category.name}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground/60">
                        {new Date(post.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <h3 className="font-semibold text-base leading-snug mb-3 line-clamp-2">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="hover:text-muted-foreground transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                    </h3>

                    <div
                      className="text-muted-foreground text-sm line-clamp-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />

                    <Link
                      href={`/posts/${post.slug}`}
                      className="inline-block mt-4 text-xs font-semibold uppercase tracking-widest hover:text-muted-foreground transition-colors"
                    >
                      Czytaj →
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
