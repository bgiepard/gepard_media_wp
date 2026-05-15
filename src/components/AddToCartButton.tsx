'use client'

import { useCart, CartItem } from '@/context/CartContext'
import { useState } from 'react'

interface Props {
  product: Omit<CartItem, 'quantity'>
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${
        added
          ? 'bg-green-500 text-white'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {added ? '✓ Dodano do koszyka' : 'Dodaj do koszyka'}
    </button>
  )
}
