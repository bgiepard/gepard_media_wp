import Link from 'next/link'
import CartIcon from '@/components/CartIcon'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          Gepard<span className="text-blue-600">.</span>media
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-gray-900 transition-colors">Blog</Link>
          <Link href="/sklep" className="hover:text-gray-900 transition-colors">Sklep</Link>
          <Link href="/o-nas" className="hover:text-gray-900 transition-colors">O nas</Link>
          <Link href="/kontakt" className="hover:text-gray-900 transition-colors">Kontakt</Link>
          <CartIcon />
          <Link
            href="/kontakt"
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Napisz do nas
          </Link>
        </nav>
      </div>
    </header>
  )
}
