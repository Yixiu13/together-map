import { Heart } from 'lucide-react'
import { useNow } from '@/hooks/useNow'
import { elapsedSince } from '@/lib/countdown'
import { formatDate } from '@/lib/utils'

interface SiteFooterProps {
  names: string
  startDate: string
}

export function SiteFooter({ names, startDate }: SiteFooterProps) {
  const now = useNow(60000)
  const { days } = elapsedSince(startDate, now)

  return (
    <footer className="border-t border-paper-line bg-paper-deep/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-6 py-12 text-center sm:px-10">
        <p className="font-script text-2xl text-ink">{names}</p>
        <p className="inline-flex items-center gap-2 text-sm text-ink-soft">
          <Heart className="h-3.5 w-3.5 text-rose" aria-hidden />
          {formatDate(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`)} ·
          在一起第 <span className="tabular-nums text-rose">{days}</span> 天
        </p>
        <p className="mt-2 text-[11px] tracking-[0.2em] text-ink-soft/70">
          © {now.getFullYear()} · 一本关于我们的旅行回忆录
        </p>
      </div>
    </footer>
  )
}
