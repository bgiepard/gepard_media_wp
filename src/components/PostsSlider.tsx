'use client'

import { WPPost } from '@/types/wordpress'
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

  return (
    <section className="relative w-full overflow-hidden rounded-2xl bg-gray-900 shadow-xl">
      <div className="relative h-[480px]">
        {image ? (
          <Image
            src={image.source_url}
            alt={image.alt_text || post.title.rendered}
            fill
            priority={current === 0}
            sizes="100vw"
            className="object-cover opacity-50"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-gray-900" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="flex items-center gap-3 text-sm text-gray-300 mb-3">
            <time>
              {new Date(post.date).toLocaleDateString('pl-PL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
            {author && <><span>·</span><span>{author.name}</span></>}
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 max-w-2xl leading-tight">
            <Link
              href={`/posts/${post.slug}`}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              className="hover:text-blue-400 transition-colors"
            />
          </h2>

          <div
            className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-xl mb-6"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />

          <Link
            href={`/posts/${post.slug}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Czytaj dalej →
          </Link>
        </div>
      </div>

      {posts.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Poprzedni"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Następny"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            ›
          </button>

          <div className="absolute bottom-4 right-8 flex gap-2">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slajd ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'bg-white w-6' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
