import { getProductBySlug } from '@/lib/woocommerce'
import AddToCartButton from '@/components/AddToCartButton'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const image = product.images[0]
  const onSale = product.sale_price && product.sale_price !== product.regular_price

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/sklep" className="text-sm text-blue-600 hover:underline mb-8 inline-block">
        ← Wróć do sklepu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="rounded-2xl overflow-hidden bg-gray-50 aspect-square">
          {image ? (
            <img src={image.src} alt={image.alt || product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100" />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">{product.price} zł</span>
              {onSale && (
                <span className="text-lg text-gray-400 line-through">{product.regular_price} zł</span>
              )}
            </div>
          </div>

          <div
            className="text-gray-600 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />

          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              product.stock_status === 'instock'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}>
              {product.stock_status === 'instock' ? 'Dostępny' : 'Brak w magazynie'}
            </span>
          </div>

          {product.stock_status === 'instock' && (
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
            <div className="border-t border-gray-100 pt-6">
              <h2 className="font-semibold mb-3">Opis produktu</h2>
              <div
                className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
