import { getProductBySlug, getAllProductSlugs } from '@/lib/woocommerce'
import AddToCartButton from '@/components/AddToCartButton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return slugs.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.short_description.replace(/<[^>]+>/g, '').slice(0, 160),
    openGraph: product.images[0] ? { images: [product.images[0].src] } : undefined,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const image = product.images[0]
  const onSale = product.sale_price && product.sale_price !== product.regular_price
  const inStock = product.stock_status === 'instock'

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <Link href="/sklep" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
        ← Wróć do sklepu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            {product.categories[0] && (
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                {product.categories[0].name}
              </p>
            )}
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">{product.name}</h1>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{product.price} zł</span>
              {onSale && (
                <span className="text-lg text-muted-foreground line-through">{product.regular_price} zł</span>
              )}
              {onSale && <Badge className="bg-foreground text-background">Promocja</Badge>}
            </div>
          </div>

          {product.short_description && (
            <div
              className="text-muted-foreground text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

          <Separator />

          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-400'}`} />
            <span className="text-sm text-muted-foreground">
              {inStock ? 'Dostępny w magazynie' : 'Brak w magazynie'}
            </span>
          </div>

          {inStock && (
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: image?.src,
              }}
            />
          )}

          {product.description && (
            <>
              <Separator />
              <div>
                <h2 className="font-semibold mb-4 text-sm uppercase tracking-widest text-muted-foreground">Opis produktu</h2>
                <div
                  className="text-sm leading-relaxed text-muted-foreground prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
