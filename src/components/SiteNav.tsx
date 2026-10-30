import { useEffect, useState } from 'react'
import { PenLine } from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '#home', label: '扉页' },
  { href: '#countdown', label: '倒数日' },
  { href: '#map', label: '旅行地图' },
  { href: '#memoir', label: '回忆录' },
  { href: '#milestones', label: '纪念日' },
]

interface SiteNavProps {
  title: string
  onEdit: () => void
}

export function SiteNav({ title, onEdit }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-paper-line bg-paper/85 backdrop-blur-md'
          : 'border-b border-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
        <a
          href="#home"
          className="cursor-pointer font-script text-xl text-ink transition-colors duration-200 hover:text-rose"
        >
          {title}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="cursor-pointer text-sm text-ink-soft transition-colors duration-200 hover:text-rose"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-paper-line bg-white/70 px-4 py-2 text-xs tracking-[0.15em] text-ink transition-colors duration-200 hover:border-rose hover:text-rose"
        >
          <PenLine className="h-3.5 w-3.5" aria-hidden />
          书写回忆
        </button>
      </nav>
    </header>
  )
}
