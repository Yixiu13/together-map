import { CalendarHeart, Compass, Sparkles } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { useNow } from '@/hooks/useNow'
import { nextAnniversary, nextDayMark, nthAnniversary, untilDate } from '@/lib/countdown'
import { formatDate, formatShortDate, pad2 } from '@/lib/utils'
import type { Milestone, SiteData } from '@/types'

interface CountdownSectionProps {
  data: SiteData
}

function toKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function CountdownSection({ data }: CountdownSectionProps) {
  const now = useNow(1000)
  const info = nextAnniversary(data.startDate, now)
  const previous = nthAnniversary(data.startDate, info.years - 1)
  const span = info.date.getTime() - previous.getTime()
  const progress = Math.min(
    100,
    Math.max(0, ((now.getTime() - previous.getTime()) / (span || 1)) * 100),
  )
  const remain = untilDate(info.date, now)
  const dayMark = nextDayMark(data.startDate, now)

  const custom = data.milestones
    .filter((item) => new Date(`${item.date}T00:00:00`).getTime() > now.getTime())
    .sort((a, b) => a.date.localeCompare(b.date))[0] as Milestone | undefined

  const cards = [
    {
      key: 'anniversary',
      icon: <CalendarHeart className="h-4 w-4 text-rose" aria-hidden />,
      label: `${info.years} 周年`,
      days: remain.days,
      date: toKey(info.date),
      accent: 'text-rose',
    },
    dayMark
      ? {
          key: 'daymark',
          icon: <Sparkles className="h-4 w-4 text-gold" aria-hidden />,
          label: `在一起第 ${dayMark.days} 天`,
          days: untilDate(dayMark.date, now).days,
          date: toKey(dayMark.date),
          accent: 'text-gold',
        }
      : null,
    custom
      ? {
          key: 'custom',
          icon: <Compass className="h-4 w-4 text-teal" aria-hidden />,
          label: custom.label,
          days: untilDate(new Date(`${custom.date}T00:00:00`), now).days,
          date: custom.date,
          accent: 'text-teal',
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null)

  return (
    <section id="countdown" className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
      <Reveal>
        <SectionHeading
          en="COUNTDOWN"
          title="倒数日"
          subtitle="每一个还差几天的日子，都值得被提前期待。"
        />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <Reveal className="rounded-2xl border border-paper-line bg-white/65 p-8 sm:p-10">
          <p className="text-xs tracking-[0.35em] text-ink-soft">距离下一个纪念日</p>

          <div className="mt-4 flex items-end gap-4">
            <span className="font-body text-7xl font-medium tabular-nums text-rose sm:text-8xl">
              {remain.days}
            </span>
            <span className="pb-4 font-script text-2xl text-ink">天</span>
          </div>

          <p className="mt-3 font-body text-sm tabular-nums text-ink-soft">
            {pad2(remain.hours)} : {pad2(remain.minutes)} : {pad2(remain.seconds)}
          </p>

          <div className="mt-8">
            <div className="flex items-center justify-between text-[11px] text-ink-soft">
              <span>{formatShortDate(toKey(previous))}</span>
              <span>{formatShortDate(toKey(info.date))}</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-deep">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-soft to-rose transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-ink-soft">
              第 {info.years} 年已经走过了 {Math.round(progress)}%
            </p>
          </div>
        </Reveal>

        <Reveal delay={120} className="space-y-4">
          {cards.map((card) => (
            <div
              key={card.key}
              className="flex cursor-default items-center justify-between rounded-xl border border-paper-line bg-white/70 px-5 py-4 transition-colors duration-200 hover:border-rose/50"
            >
              <div className="flex items-center gap-3">
                {card.icon}
                <div>
                  <p className="font-script text-lg text-ink">{card.label}</p>
                  <p className="text-[11px] tabular-nums text-ink-soft">
                    {formatDate(card.date)}
                  </p>
                </div>
              </div>
              <p className="text-right">
                <span className={`font-body text-2xl tabular-nums ${card.accent}`}>
                  {card.days}
                </span>
                <span className="ml-1 text-xs text-ink-soft">天后</span>
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
