import Link from 'next/link'

interface Props {
  searchParams: Promise<{ order_id?: string }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const { order_id } = await searchParams

  return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-3xl font-bold mb-3">Dziękujemy za zamówienie!</h1>
      {order_id && (
        <p className="text-gray-500 mb-2 text-sm">Numer zamówienia: <span className="font-semibold">#{order_id}</span></p>
      )}
      <p className="text-gray-500 mb-10">Potwierdzenie zostało wysłane na Twój adres email.</p>
      <Link
        href="/sklep"
        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
      >
        Wróć do sklepu
      </Link>
    </main>
  )
}
