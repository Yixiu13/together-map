import { useEffect, useState } from 'react'

/** 每秒刷新一次当前时间，用于倒数日实时跳动 */
export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), interval)
    return () => window.clearInterval(timer)
  }, [interval])

  return now
}
