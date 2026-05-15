'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-6xl mb-6">🛒</p>
        <h1 className="text-2xl font-bold mb-3">Koszyk jest pusty</h1>
        <p className="text-gray-500 mb-8">Dodaj produkty ze sklepu, aby kontynuować.</p>
        <Link href="/sklep" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
          Przejdź do sklepu
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-10">Koszyk</h1>

      <div className="flex flex-col gap-4 mb-10">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link href={`/sklep/${item.slug}`} className="font-semibold hover:text-blue-600 transition-colors truncate block">
                {item.name}
              </Link>
              <p className="text-gray-500 text-sm">{item.price} zł / szt.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors font-medium"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors font-medium"
              >
                +
              </button>
            </div>

            <p className="font-bold text-lg w-24 text-right">
              {(parseFloat(item.price) * item.quantity).toFixed(2)} zł
            </p>

            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-300 hover:text-red-500 transition-colors ml-2"
              aria-label="Usuń"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-gray-100 pt-8">
        <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
          Wyczyść koszyk
        </button>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          <p className="text-xl font-bold">
            Razem: <span className="text-blue-600">{totalPrice.toFixed(2)} zł</span>
          </p>
          <button
            onClick={() => router.push('/checkout')}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            Zamów →
          </button>
        </div>
      </div>
    </main>
  )
}
