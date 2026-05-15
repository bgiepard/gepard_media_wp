import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-1">
            <p className="text-xl font-bold tracking-tight mb-3">
              gepard<span className="text-background/40 font-light">.media</span>
            </p>
            <p className="text-background/60 text-sm leading-relaxed max-w-xs">
              Tworzymy strony i aplikacje internetowe, które działają szybko i wyglądają świetnie.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-background/40 mb-4 font-semibold">Nawigacja</p>
            <nav className="flex flex-col gap-2.5 text-sm text-background/70">
              <Link href="/" className="hover:text-background transition-colors">Blog</Link>
              <Link href="/sklep" className="hover:text-background transition-colors">Sklep</Link>
              <Link href="/o-nas" className="hover:text-background transition-colors">O nas</Link>
              <Link href="/kontakt" className="hover:text-background transition-colors">Kontakt</Link>
            </nav>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-background/40 mb-4 font-semibold">Kontakt</p>
            <div className="flex flex-col gap-2.5 text-sm text-background/70">
              <a href="mailto:kontakt@gepard.media" className="hover:text-background transition-colors">
                kontakt@gepard.media
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-background/10 mb-6" />

        <p className="text-xs text-background/40">
          © {new Date().getFullYear()} Gepard.media — Wszelkie prawa zastrzeżone
        </p>
      </div>
    </footer>
  )
}
