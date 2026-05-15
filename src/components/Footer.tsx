import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="text-white text-xl font-bold tracking-tight mb-2">
              Gepard<span className="text-blue-500">.</span>media
            </p>
            <p className="text-sm max-w-xs">
              Tworzymy strony i aplikacje internetowe, które działają szybko i wyglądają świetnie.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <p className="text-white font-semibold">Nawigacja</p>
              <Link href="/" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/o-nas" className="hover:text-white transition-colors">O nas</Link>
              <Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-white font-semibold">Kontakt</p>
              <span>kontakt@gepard.media</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center">
          © {new Date().getFullYear()} Gepard.media — Wszelkie prawa zastrzeżone
        </div>
      </div>
    </footer>
  )
}
