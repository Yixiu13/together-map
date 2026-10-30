import { Heart, MapPin, Sparkles } from 'lucide-react'
import { elapsedSince, nextAnniversary, nextDayMark, untilDate } from '@/lib/countdown'
import { formatDate, formatShortDate, formatWeekday, pad2 } from '@/lib/utils'

interface CountdownBoardProps {
  startDate: string
  names: string
  now: Date
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="w-14 rounded-lg border border-paper-line bg-white/70 py-2 text-center font-body text-2xl tabular-nums text-ink sm:w-16 sm:text-3xl">
        {pad2(value)}
      </span>
      <span className="text-[11px] tracking-[0.3em] text-ink-soft">{label}</span>
    </div>
  )
}

export function CountdownBoard({ startDate, names, now }: CountdownBoardProps) {
  const elapsed = elapsedSince(startDate, now)
  const anniversary = nextAnniversary(startDate, now)
  const dayMark = nextDayMark(startDate, now)
  const remain = untilDate(anniversary.date, now)

  const markRemain = dayMark ? untilDate(dayMark.date, now) : null

  return (
    <div className="relative">
      <div className="absolute -right-3 -top-8 hidden rotate-12 opacity-70 sm:block">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-rose/50 text-center font-script text-sm leading-tight text-rose/70">
          相守
          <br />
          如初
        </span>
      </div>

      <div className="rounded-2xl border border-paper-line bg-white/70 p-6 shadow-[0_18px_50px_-30px_rgba(43,39,35,0.45)] backdrop-blur-sm sm:p-8">
        <div className="flex items-center gap-2 text-rose">
          <Sparkles className="h-4 w-4" aria-hidden />
          <p className="text-xs tracking-[0.35em] text-ink-soft">LOVE COUNTDOWN</p>
        </div>

        <div className="mt-5">
          <p className="font-script text-2xl text-ink">{names}</p>
          <p className="mt-1 text-xs tracking-[0.2em] text-ink-soft">
            {formatDate(startDate)} · {formatWeekday(startDate)} · 在一起
          </p>
        </div>

        <div className="mt-5 flex items-end gap-3">
          <span className="font-body text-6xl font-medium tabular-nums text-rose sm:text-7xl">
            {elapsed.days}
          </span>
          <span className="pb-3 font-script text-xl text-ink">天</span>
        </div>

        <div className="mt-5 flex gap-3">
          <Digit value={elapsed.hours} label="时" />
          <Digit value={elapsed.minutes} label="分" />
          <Digit value={elapsed.seconds} label="秒" />
        </div>

        <div className="mt-7 space-y-3 border-t border-paper-line pt-5">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-sm text-ink">
              <Heart className="h-4 w-4 text-rose" aria-hidden />
              距离 {anniversary.years} 周年
            </span>
            <span className="text-sm tabular-nums text-ink-soft">
              还有 <b className="font-body text-lg text-rose">{remain.days}</b> 天 ·{' '}
              {formatShortDate(`${anniversary.date.getFullYear()}-${pad2(
                anniversary.date.getMonth() + 1,
              )}-${pad2(anniversary.date.getDate())}`)}
            </span>
          </div>

          {dayMark && markRemain && (
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 text-sm text-ink">
                <MapPin className="h-4 w-4 text-teal" aria-hidden />
                距离第 {dayMark.days} 天
              </span>
              <span className="text-sm tabular-nums text-ink-soft">
                还有 <b className="font-body text-lg text-teal">{markRemain.days}</b> 天
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
