import { getProducts } from '@/lib/woocommerce'
import Link from 'next/link'

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-10">Sklep</h1>

      {products.length === 0 && (
        <p className="text-gray-500">Brak produktów w sklepie.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => {
          const image = product.images[0]
          const onSale = product.sale_price && product.sale_price !== product.regular_price

          return (
            <article key={product.id} className="group flex flex-col border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="overflow-hidden bg-gray-50 h-56">
                {image ? (
                  <img
                    src={image.src}
                    alt={image.alt || product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100" />
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-semibold text-lg mb-2 leading-snug">
                  <Link href={`/sklep/${product.slug}`} className="hover:text-blue-600 transition-colors">
                    {product.name}
                  </Link>
                </h2>

                <div
                  className="text-gray-500 text-sm line-clamp-2 flex-1 mb-4"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      {product.price} zł
                    </span>
                    {onSale && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.regular_price} zł
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    product.stock_status === 'instock'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {product.stock_status === 'instock' ? 'Dostępny' : 'Brak'}
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
