'use client'

import { WPPost } from '@/types/wordpress'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  posts: WPPost[]
}

export default function PostsSlider({ posts }: Props) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((i) => (i === 0 ? posts.length - 1 : i - 1))
  const next = () => setCurrent((i) => (i === posts.length - 1 ? 0 : i + 1))

  const post = posts[current]
  const image = post._embedded?.['wp:featuredmedia']?.[0]
  const author = post._embedded?.author?.[0]
  const category = post._embedded?.['wp:term']?.[0]?.[0]

  return (
    <section className="relative w-full overflow-hidden rounded-2xl bg-foreground shadow-2xl">
      <div className="relative h-[520px] md:h-[580px]">
        {image ? (
          <Image
            src={image.source_url}
            alt={image.alt_text || post.title.rendered}
            fill
            priority={current === 0}
            sizes="100vw"
            className="object-cover opacity-40"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <div className="flex items-center gap-3 mb-5">
            {category && (
              <Badge variant="secondary" className="bg-white/15 text-white border-0 text-xs uppercase tracking-widest font-semibold backdrop-blur-sm">
                {category.name}
              </Badge>
            )}
            <span className="text-white/50 text-xs">
              {new Date(post.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {author && <span className="text-white/50 text-xs">· {author.name}</span>}
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 max-w-3xl leading-tight tracking-tight">
            <Link
              href={`/posts/${post.slug}`}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              className="hover:text-white/80 transition-colors"
            />
          </h2>

          <div
            className="text-white/60 text-sm md:text-base line-clamp-2 max-w-2xl mb-8 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />

          <Link href={`/posts/${post.slug}`} className={cn(buttonVariants({ variant: 'secondary' }), 'bg-white text-foreground hover:bg-white/90 font-semibold rounded-full px-6')}>
            Czytaj artykuł →
          </Link>
        </div>
      </div>

      {posts.length > 1 && (
        <>
          <button onClick={prev} aria-label="Poprzedni" className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all backdrop-blur-sm text-lg">‹</button>
          <button onClick={next} aria-label="Następny" className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all backdrop-blur-sm text-lg">›</button>

          <div className="absolute bottom-8 right-10 flex gap-1.5">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slajd ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-8' : 'bg-white/30 w-4'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
