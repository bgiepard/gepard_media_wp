'use client'

import { useCart, CartItem } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
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
    <Button
      onClick={handleAdd}
      size="lg"
      className="w-full rounded-full font-semibold"
      variant={added ? 'secondary' : 'default'}
    >
      {added ? '✓ Dodano do koszyka' : 'Dodaj do koszyka'}
    </Button>
  )
}
