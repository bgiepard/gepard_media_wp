'use client'

import { useCart } from '@/context/CartContext'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Billing {
  first_name: string
  last_name: string
  email: string
  address_1: string
  city: string
  postcode: string
  country: string
}

const emptyBilling: Billing = {
  first_name: '',
  last_name: '',
  email: '',
  address_1: '',
  city: '',
  postcode: '',
  country: 'PL',
}

function PaymentStep({ clientSecret, orderId }: { clientSecret: string; orderId: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/zamowienie/sukces?order_id=${orderId}`,
      },
    })

    if (error) {
      setError(error.message ?? 'Błąd płatności')
      setLoading(false)
    } else {
      clearCart()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Przetwarzanie...' : 'Zapłać'}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart()
  const [billing, setBilling] = useState<Billing>(emptyBilling)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleBillingSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, billing }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Błąd serwera')
      setLoading(false)
      return
    }

    setClientSecret(data.clientSecret)
    setOrderId(data.orderId)
    setLoading(false)
  }

  const field = (label: string, key: keyof Billing, type = 'text') => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        required
        value={billing[key]}
        onChange={(e) => setBilling((b) => ({ ...b, [key]: e.target.value }))}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )

  if (items.length === 0) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Koszyk jest pusty.</p>
        <Link href="/sklep" className="text-blue-600 hover:underline">Wróć do sklepu</Link>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-10">Zamówienie</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {!clientSecret ? (
            <>
              <h2 className="text-xl font-semibold mb-6">Dane do wysyłki</h2>
              <form onSubmit={handleBillingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {field('Imię', 'first_name')}
                  {field('Nazwisko', 'last_name')}
                </div>
                {field('Email', 'email', 'email')}
                {field('Ulica i numer', 'address_1')}
                <div className="grid grid-cols-2 gap-4">
                  {field('Kod pocztowy', 'postcode')}
                  {field('Miasto', 'city')}
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Ładowanie...' : 'Przejdź do płatności →'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-6">Płatność</h2>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentStep clientSecret={clientSecret} orderId={orderId!} />
              </Elements>
            </>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6">Podsumowanie</h2>
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} <span className="text-gray-400">× {item.quantity}</span>
                </span>
                <span className="font-medium">
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} zł
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
              <span>Razem</span>
              <span>{totalPrice.toFixed(2)} zł</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
