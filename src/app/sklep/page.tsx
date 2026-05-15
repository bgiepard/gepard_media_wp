import { getProducts } from '@/lib/woocommerce'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sklep',
  description: 'Przeglądaj nasze produkty',
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Sklep</h1>
        <p className="text-muted-foreground">
          {products.length} {products.length === 1 ? 'produkt' : 'produktów'}
        </p>
      </div>

      {products.length === 0 && (
        <p className="text-muted-foreground py-20 text-center">Brak produktów w sklepie.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => {
          const image = product.images[0]
          const onSale = product.sale_price && product.sale_price !== product.regular_price

          return (
            <Card key={product.id} className="group overflow-hidden border-border/60 hover:border-border hover:shadow-lg transition-all duration-300 py-0 gap-0">
              <div className="relative h-56 overflow-hidden bg-muted">
                {image ? (
                  <Image
                    src={image.src}
                    alt={image.alt || product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                )}
                {onSale && (
                  <Badge className="absolute top-3 left-3 bg-foreground text-background text-xs">
                    Promocja
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                <h2 className="font-semibold text-sm leading-snug mb-3 line-clamp-2">
                  <Link href={`/sklep/${product.slug}`} className="hover:text-muted-foreground transition-colors">
                    {product.name}
                  </Link>
                </h2>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">{product.price} zł</span>
                    {onSale && (
                      <span className="text-xs text-muted-foreground line-through">{product.regular_price} zł</span>
                    )}
                  </div>
                  <Badge
                    variant={product.stock_status === 'instock' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {product.stock_status === 'instock' ? 'Dostępny' : 'Brak'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
