import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpress'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const image = post._embedded?.['wp:featuredmedia']?.[0]
  return {
    title: post.title.rendered.replace(/<[^>]+>/g, ''),
    description: post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 160),
    openGraph: image ? { images: [image.source_url] } : undefined,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const image = post._embedded?.['wp:featuredmedia']?.[0]
  const author = post._embedded?.author?.[0]
  const category = post._embedded?.['wp:term']?.[0]?.[0]

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
        ← Blog
      </Link>

      {category && (
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4">
          {category.name}
        </p>
      )}

      <h1
        className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-10">
        <time>
          {new Date(post.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
        </time>
        {author && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <span>{author.name}</span>
          </>
        )}
      </div>

      {image && (
        <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-12 bg-muted">
          <Image
            src={image.source_url}
            alt={image.alt_text || post.title.rendered}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-foreground prose-a:underline-offset-4 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </main>
  )
}
