import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import CartIcon from '@/components/CartIcon'

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          gepard<span className="text-muted-foreground font-light">.media</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <Link href="/" className="px-3 py-2 rounded-md hover:bg-accent hover:text-foreground transition-colors">Blog</Link>
          <Link href="/sklep" className="px-3 py-2 rounded-md hover:bg-accent hover:text-foreground transition-colors">Sklep</Link>
          <Link href="/o-nas" className="px-3 py-2 rounded-md hover:bg-accent hover:text-foreground transition-colors">O nas</Link>
          <Link href="/kontakt" className="px-3 py-2 rounded-md hover:bg-accent hover:text-foreground transition-colors">Kontakt</Link>
        </nav>

        <div className="flex items-center gap-3">
          <CartIcon />
          <Link href="/kontakt" className={cn(buttonVariants({ size: 'sm' }), 'rounded-full')}>
            Napisz do nas
          </Link>
        </div>
      </div>
    </header>
  )
}
