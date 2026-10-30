import { BookOpen, Compass, Heart } from 'lucide-react'
import { CountdownBoard } from '@/components/CountdownBoard'
import { useNow } from '@/hooks/useNow'
import { fillTokens } from '@/lib/tokens'
import type { TokenStats } from '@/lib/tokens'
import { formatDate } from '@/lib/utils'
import type { SiteData } from '@/types'

interface HeroProps {
  data: SiteData
  stats: TokenStats
}

const DOTS = [
  { x: 172, y: 96 },
  { x: 268, y: 132 },
  { x: 116, y: 168 },
  { x: 318, y: 196 },
  { x: 208, y: 228 },
]

export function Hero({ data, stats }: HeroProps) {
  const now = useNow(1000)

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pb-16 pt-28 sm:px-10"
    >
      <div
        aria-hidden
        className="paper-grain pointer-events-none absolute inset-0 opacity-[0.16]"
      />

      <svg
        aria-hidden
        viewBox="0 0 480 320"
        className="pointer-events-none absolute -right-24 top-24 hidden h-[560px] w-[560px] text-rose lg:block"
      >
        <g fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2">
          <path
            d="M40 300 C 120 250, 160 180, 210 150 S 330 130, 420 60"
            strokeDasharray="5 8"
          />
          <path
            d="M60 260 C 150 230, 200 210, 250 190 S 360 160, 440 120"
            strokeDasharray="3 10"
          />
        </g>
        {DOTS.map((dot) => (
          <g key={`${dot.x}-${dot.y}`}>
            <circle cx={dot.x} cy={dot.y} r="14" fill="currentColor" fillOpacity="0.08" />
            <circle cx={dot.x} cy={dot.y} r="3.5" fill="currentColor" fillOpacity="0.75" />
          </g>
        ))}
        <path
          d="M404 32 L456 44 L420 74 L424 58 L404 32 Z"
          fill="currentColor"
          fillOpacity="0.55"
        />
      </svg>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-rise">
          <p className="inline-flex items-center gap-2 rounded-full border border-paper-line bg-white/60 px-4 py-1.5 text-xs tracking-[0.3em] text-ink-soft">
            <Heart className="h-3.5 w-3.5 text-rose" aria-hidden />
            A TRAVEL MEMOIR OF US
          </p>

          <h1 className="mt-7 font-script text-6xl leading-[1.1] text-ink sm:text-7xl">
            {data.title}
          </h1>
          <p className="font-en-hand mt-2 text-3xl text-rose sm:text-4xl">Together, Map by Map</p>

          <p className="mt-6 max-w-xl font-body text-[15px] leading-relaxed text-ink-soft">
            {fillTokens(data.subtitle, stats)}
          </p>

          <div className="mt-8 flex items-center gap-6 font-body text-sm text-ink-soft">
            <span className="inline-flex items-center gap-2">
              <span className="h-px w-8 bg-rose/60" aria-hidden />
              {formatDate(data.startDate)}
            </span>
            <span className="text-rose">{data.names}</span>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#map"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm tracking-[0.15em] text-paper transition-colors duration-200 hover:bg-rose"
            >
              <Compass className="h-4 w-4" aria-hidden />
              打开我们的地图
            </a>
            <a
              href="#memoir"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink/25 px-6 py-3 text-sm tracking-[0.15em] text-ink transition-colors duration-200 hover:border-rose hover:text-rose"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              翻开回忆录
            </a>
          </div>
        </div>

        <div className="animate-rise [animation-delay:220ms]">
          <CountdownBoard startDate={data.startDate} names={data.names} now={now} />
        </div>
      </div>

      <a
        href="#prologue"
        aria-label="向下滚动"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.3em] text-ink-soft transition-colors duration-200 hover:text-rose md:flex"
      >
        向下
        <span className="h-10 w-px bg-gradient-to-b from-ink-soft to-transparent" aria-hidden />
      </a>
    </section>
  )
}
