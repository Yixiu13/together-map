import { useCallback, useEffect, useMemo, useState } from 'react'
import { defaultData } from '@/data/defaults'
import { createId } from '@/lib/utils'
import type { MemoryEntry, SiteData, TravelStop } from '@/types'

const STORAGE_KEY = 'together-map:site-data:v1'

function load(): SiteData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData
    const parsed = JSON.parse(raw) as Partial<SiteData>
    return { ...defaultData, ...parsed }
  } catch {
    return defaultData
  }
}

export function useSiteData() {
  const [data, setData] = useState<SiteData>(load)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const update = useCallback(<K extends keyof SiteData>(key: K, value: SiteData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const addStop = useCallback(() => {
    setData((prev) => ({
      ...prev,
      stops: [
        ...prev.stops,
        {
          id: createId('stop'),
          name: '新城市',
          province: '',
          lng: 110,
          lat: 33,
          date: prev.startDate,
          status: 'visited',
          note: '',
        },
      ],
    }))
  }, [])

  const updateStop = useCallback((id: string, patch: Partial<TravelStop>) => {
    setData((prev) => ({
      ...prev,
      stops: prev.stops.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  }, [])

  const removeStop = useCallback((id: string) => {
    setData((prev) => ({ ...prev, stops: prev.stops.filter((s) => s.id !== id) }))
  }, [])

  const addMemory = useCallback(() => {
    setData((prev) => ({
      ...prev,
      memories: [
        ...prev.memories,
        {
          id: createId('mem'),
          date: new Date().toISOString().slice(0, 10),
          title: `第${prev.memories.length + 1}章 · 新的故事`,
          place: '',
          body: '',
          photo: '',
          scene: 'city',
          weather: '',
        },
      ],
    }))
  }, [])

  const updateMemory = useCallback((id: string, patch: Partial<MemoryEntry>) => {
    setData((prev) => ({
      ...prev,
      memories: prev.memories.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }))
  }, [])

  const removeMemory = useCallback((id: string) => {
    setData((prev) => ({ ...prev, memories: prev.memories.filter((m) => m.id !== id) }))
  }, [])

  const reset = useCallback(() => {
    setData(defaultData)
  }, [])

  const replace = useCallback((next: SiteData) => {
    setData(next)
  }, [])

  const sortedMemories = useMemo(
    () => [...data.memories].sort((a, b) => a.date.localeCompare(b.date)),
    [data.memories],
  )

  const sortedStops = useMemo(
    () => [...data.stops].sort((a, b) => a.date.localeCompare(b.date)),
    [data.stops],
  )

  return {
    data,
    sortedMemories,
    sortedStops,
    update,
    addStop,
    updateStop,
    removeStop,
    addMemory,
    updateMemory,
    removeMemory,
    reset,
    replace,
  }
}

export type SiteDataStore = ReturnType<typeof useSiteData>
