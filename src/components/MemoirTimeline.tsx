import { CalendarDays, MapPin } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { SceneArt } from '@/components/SceneArt'
import { fillTokens } from '@/lib/tokens'
import type { TokenStats } from '@/lib/tokens'
import { formatDate, formatShortDate, formatWeekday } from '@/lib/utils'
import type { MemoryEntry } from '@/types'

interface MemoirTimelineProps {
  memories: MemoryEntry[]
  stats: TokenStats
}

export function MemoirTimeline({ memories, stats }: MemoirTimelineProps) {
  return (
    <ol className="relative space-y-20 pl-10 md:space-y-24 md:pl-0">
      <span
        aria-hidden
        className="absolute left-[6px] top-0 h-full w-px bg-gradient-to-b from-transparent via-paper-line to-transparent md:left-1/2 md:-translate-x-1/2"
      />

      {memories.map((memory, index) => {
        const isRight = index % 2 === 1

        return (
          <Reveal
            key={memory.id}
            as="li"
            className="relative md:grid md:grid-cols-[1fr_80px_1fr] md:items-center"
          >
            <span
              aria-hidden
              className="absolute left-[-34px] top-8 h-3 w-3 rounded-full border-2 border-rose bg-paper md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
            />

            <div
              className={
                isRight ? 'md:col-start-3 md:row-start-1' : 'md:col-start-1 md:row-start-1'
              }
            >
              <div className="group relative aspect-[4/3] rotate-[-1.4deg] overflow-hidden rounded-sm border-[6px] border-white bg-paper-deep shadow-[0_22px_44px_-28px_rgba(43,39,35,0.55)] transition-transform duration-300 hover:rotate-0">
                {memory.photo ? (
                  <img
                    src={memory.photo}
                    alt={memory.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <SceneArt kind={memory.scene} />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] tracking-[0.25em] text-white/90">
                  <span>{memory.weather}</span>
                  <span className="tabular-nums">{formatShortDate(memory.date)}</span>
                </div>
              </div>
            </div>

            <div
              className={`mt-7 md:mt-0 ${
                isRight
                  ? 'md:col-start-1 md:row-start-1 md:text-right'
                  : 'md:col-start-3 md:row-start-1'
              }`}
            >
              <div
                className={`flex items-center gap-3 text-xs tracking-[0.25em] text-ink-soft ${
                  isRight ? 'md:justify-end' : ''
                }`}
              >
                <span className="text-rose">CHAPTER {String(index + 1).padStart(2, '0')}</span>
                <span className="h-px w-6 bg-rose/40" aria-hidden />
                <span>{formatWeekday(memory.date)}</span>
              </div>

              <h3 className="mt-3 font-script text-3xl leading-snug text-ink sm:text-4xl">
                {memory.title}
              </h3>

              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-soft">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                {formatDate(memory.date)}
                <span className="mx-1 text-paper-line">|</span>
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {memory.place}
              </p>

              <p className="mt-4 font-body text-[15px] leading-[2.1] text-ink/80">
                {fillTokens(memory.body, stats)}
              </p>
            </div>
          </Reveal>
        )
      })}
    </ol>
  )
}
