import { useMemo } from 'react'
import { Flag, Gift } from 'lucide-react'
import { useNow } from '@/hooks/useNow'
import { buildMilestones, nextDayMark } from '@/lib/countdown'
import { daysBetween, formatShortDate, pad2 } from '@/lib/utils'

interface MilestoneRailProps {
  startDate: string
}

function toKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function MilestoneRail({ startDate }: MilestoneRailProps) {
  const now = useNow(60000)

  const items = useMemo(() => {
    const list = buildMilestones(startDate, now)
    const mark = nextDayMark(startDate, now)
    if (mark) {
      list.push({
        id: 'next-mark',
        label: `第 ${mark.days} 天`,
        date: toKey(mark.date),
        note: '正在倒数',
        done: false,
      })
    }
    return list.sort((a, b) => a.date.localeCompare(b.date))
  }, [startDate, now])

  const todayKey = toKey(now)

  const visible = items.filter((item) => item.done || item.date >= todayKey).slice(-12)

  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute left-0 right-0 top-[11px] hidden h-px bg-paper-line md:block"
      />

      <ul className="flex gap-5 overflow-x-auto pb-6 pt-0 md:pt-7">
        {visible.map((item) => {
          const isToday = item.date === todayKey
          const remain = daysBetween(now, new Date(`${item.date}T00:00:00`))
          const isFuture = remain > 0

          return (
            <li
              key={item.id}
              className="relative w-[190px] shrink-0 cursor-default transition-transform duration-300 hover:-translate-y-1"
            >
              <span
                aria-hidden
                className={`absolute left-6 top-[6px] hidden h-[11px] w-[11px] rounded-full border-2 md:block ${
                  item.done
                    ? 'border-paper bg-rose'
                    : 'border-teal bg-paper'
                }`}
              />

              <div
                className={`rounded-xl border bg-white/70 p-4 transition-colors duration-200 hover:border-rose/60 ${
                  isToday ? 'border-rose shadow-[0_14px_34px_-22px_rgba(180,84,74,0.9)]' : 'border-paper-line'
                }`}
              >
                <p className="text-[11px] tabular-nums tracking-[0.2em] text-ink-soft">
                  {formatShortDate(item.date)}
                </p>
                <p className="mt-2 font-script text-xl text-ink">{item.label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{item.note}</p>

                <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-rose">
                  {isFuture ? (
                    <>
                      <Flag className="h-3 w-3" aria-hidden />
                      还有 {remain} 天
                    </>
                  ) : (
                    <>
                      <Gift className="h-3 w-3" aria-hidden />
                      已过去 {Math.abs(remain)} 天
                    </>
                  )}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
