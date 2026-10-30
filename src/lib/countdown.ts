import { daysBetween, parseDate } from './utils'

export interface DurationParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/** 已经在一起多久（精确到秒） */
export function elapsedSince(startDate: string, now: Date): DurationParts {
  const start = parseDate(startDate)
  const ms = Math.max(0, now.getTime() - start.getTime())
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

/** 某个未来日期还剩多久（按自然日计算，返回整天数 + 时分秒） */
export function untilDate(target: Date, now: Date): DurationParts {
  const ms = target.getTime() - now.getTime()
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

/** 第 n 个周年纪念日 */
export function nthAnniversary(startDate: string, n: number) {
  const start = parseDate(startDate)
  return new Date(start.getFullYear() + n, start.getMonth(), start.getDate())
}

export interface AnniversaryInfo {
  years: number
  date: Date
  remain: DurationParts
}

/** 下一个即将到来的周年纪念日 */
export function nextAnniversary(startDate: string, now: Date): AnniversaryInfo {
  const start = parseDate(startDate)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let years = today.getFullYear() - start.getFullYear()
  let date = nthAnniversary(startDate, years)
  if (date.getTime() < today.getTime()) {
    years += 1
    date = nthAnniversary(startDate, years)
  }
  return { years, date, remain: untilDate(date, now) }
}

/** 上一个已经过去的纪念日（用于展示「上一个里程碑」） */
export function lastAnniversary(startDate: string, now: Date) {
  const info = nextAnniversary(startDate, now)
  const years = info.years - 1
  return { years, date: nthAnniversary(startDate, years) }
}

const DAY_MARKS = [100, 365, 500, 1000, 1500, 2000, 3000, 3650]

export interface DayMark {
  days: number
  date: Date
}

/** 即将到来的「整数天」纪念日，如第 2000 天 */
export function nextDayMark(startDate: string, now: Date): DayMark | null {
  const start = parseDate(startDate)
  const elapsed = daysBetween(start, now)
  const target = DAY_MARKS.find((d) => d > elapsed)
  if (!target) return null
  return { days: target, date: new Date(start.getTime() + target * 86400000) }
}

export interface GeneratedMilestone {
  id: string
  label: string
  date: string
  note: string
  done: boolean
}

function toKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

/** 由在一起日期自动生成的一串纪念日（含已过去的） */
export function buildMilestones(startDate: string, now: Date): GeneratedMilestone[] {
  const start = parseDate(startDate)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const totalYears = Math.max(1, today.getFullYear() - start.getFullYear() + 1)
  const list: GeneratedMilestone[] = []

  for (const days of DAY_MARKS) {
    const date = new Date(start.getTime() + days * 86400000)
    if (date.getTime() > today.getTime()) break
    list.push({
      id: `day-${days}`,
      label: `在一起第 ${days} 天`,
      date: toKey(date),
      note: '又一个被记住的日子',
      done: true,
    })
  }

  for (let n = 1; n <= totalYears; n += 1) {
    const date = nthAnniversary(startDate, n)
    list.push({
      id: `anniversary-${n}`,
      label: `${['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][n - 1] ?? n}周年`,
      date: toKey(date),
      note: n === 1 ? '第一年结束了，还有好多年' : '又一年，还是你',
      done: date.getTime() <= today.getTime(),
    })
  }

  return list.sort((a, b) => a.date.localeCompare(b.date))
}
