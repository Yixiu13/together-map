import { useMemo } from 'react'
import { useNow } from '@/hooks/useNow'
import { elapsedSince, nextAnniversary, untilDate } from '@/lib/countdown'
import type { TokenStats } from '@/lib/tokens'
import type { SiteData } from '@/types'

/** 每分钟刷新一次，供文案里的 {days} 之类的占位符使用 */
export function useTokenStats(data: SiteData): TokenStats {
  const now = useNow(60000)
  const { startDate, stops, memories } = data

  return useMemo(() => {
    const elapsed = elapsedSince(startDate, now)
    const anniversary = nextAnniversary(startDate, now)

    return {
      days: elapsed.days,
      years: Math.max(0, anniversary.years - 1),
      cities: stops.filter((stop) => stop.status === 'visited').length,
      chapters: memories.length,
      nextDays: untilDate(anniversary.date, now).days,
    }
  }, [startDate, stops, memories.length, now])
}
