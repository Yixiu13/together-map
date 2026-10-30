import { useEffect, useMemo, useRef, useState } from 'react'
import * as echarts from 'echarts/core'
import { EffectScatterChart, LinesChart, ScatterChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { MapPin, Navigation, Route } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatShortDate } from '@/lib/utils'
import type { MemoryEntry, TravelStop } from '@/types'

echarts.use([
  GeoComponent,
  TooltipComponent,
  EffectScatterChart,
  ScatterChart,
  LinesChart,
  CanvasRenderer,
])

const INK = '#2B2723'
const ROSE = '#B4544A'
const GOLD = '#B58538'
const TEAL = '#3F6A6B'
const LAND = '#EFE4D3'
const LAND_VISITED = '#E7C6C0'
const BORDER = '#CBBCA3'

interface MemoryMapProps {
  stops: TravelStop[]
  memories: MemoryEntry[]
  activeId: string | null
  onSelect: (id: string | null) => void
}

type GeoJson = Parameters<typeof echarts.registerMap>[1]

export function MemoryMap({ stops, memories, activeId, onSelect }: MemoryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)
  const [registered, setRegistered] = useState(false)

  const visited = useMemo(() => stops.filter((s) => s.status === 'visited'), [stops])
  const planned = useMemo(() => stops.filter((s) => s.status === 'planned'), [stops])

  useEffect(() => {
    let cancelled = false

    fetch(`${import.meta.env.BASE_URL}china.json`)
      .then((res) => res.json())
      .then((geo: unknown) => {
        if (cancelled) return
        echarts.registerMap('china', geo as GeoJson)
        setRegistered(true)
      })
      .catch(() => {
        if (!cancelled) setRegistered(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const chart = echarts.init(el, undefined, { renderer: 'canvas' })
    chartRef.current = chart
    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(el)

    return () => {
      observer.disconnect()
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart || !registered) return

    const visitedProvinces = Array.from(
      new Set(visited.map((s) => s.province).filter(Boolean)),
    )

    const active = stops.find((s) => s.id === activeId)

    chart.setOption(
      {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(251,246,239,0.96)',
          borderColor: '#E3D7C4',
          borderWidth: 1,
          padding: [10, 14],
          textStyle: { color: INK, fontFamily: 'Noto Serif SC, serif', fontSize: 13 },
          formatter: (params: { name: string; data?: { note?: string; date?: string } }) => {
            const stop = stops.find((s) => s.name === params.name)
            if (!stop) return params.name
            return `<b>${stop.name}</b> · ${formatShortDate(stop.date)}<br/><span style="opacity:.7">${stop.note}</span>`
          },
        },
        geo: {
          map: 'china',
          roam: false,
          layoutCenter: ['50%', '52%'],
          layoutSize: '96%',
          itemStyle: { areaColor: LAND, borderColor: BORDER, borderWidth: 0.8 },
          emphasis: {
            disabled: true,
          },
          select: { disabled: true },
          regions: visitedProvinces.map((name) => ({
            name,
            itemStyle: { areaColor: LAND_VISITED },
          })),
        },
        series: [
          {
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 1,
            silent: true,
            lineStyle: { color: GOLD, width: 1, opacity: 0.55, curveness: 0.22 },
            data: visited.slice(1).map((stop, i) => ({
              coords: [
                [visited[i].lng, visited[i].lat],
                [stop.lng, stop.lat],
              ],
            })),
          },
          {
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 2,
            silent: true,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.5,
              symbol: 'circle',
              symbolSize: 3,
              color: ROSE,
            },
            lineStyle: { color: ROSE, width: 0.8, opacity: 0.35, curveness: 0.22 },
            data: visited.slice(1).map((stop, i) => ({
              coords: [
                [visited[i].lng, visited[i].lat],
                [stop.lng, stop.lat],
              ],
            })),
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            data: visited.map((stop, i) => ({
              id: stop.id,
              name: stop.name,
              value: [stop.lng, stop.lat],
              date: stop.date,
              note: stop.note,
              index: i + 1,
            })),
            symbolSize: (_value: unknown, params: { data: { index: number } }) =>
              params?.data?.index === 1 ? 12 : 9,
            rippleEffect: { brushType: 'stroke', scale: 3, period: 4 },
            itemStyle: { color: ROSE },
            label: {
              show: true,
              position: 'right',
              formatter: '{b}',
              color: INK,
              fontFamily: 'Noto Serif SC, serif',
              fontSize: 11,
              textBorderColor: '#FBF6EF',
              textBorderWidth: 3,
            },
            emphasis: { scale: 1.4, label: { color: ROSE, fontSize: 13 } },
          },
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            data: planned.map((stop) => ({
              id: stop.id,
              name: stop.name,
              value: [stop.lng, stop.lat],
              note: stop.note,
            })),
            symbolSize: 8,
            itemStyle: { color: '#FBF6EF', borderColor: TEAL, borderWidth: 1.4, borderType: 'dashed' },
            label: {
              show: true,
              position: 'right',
              formatter: '{b}',
              color: TEAL,
              fontFamily: 'Noto Serif SC, serif',
              fontSize: 11,
              textBorderColor: '#FBF6EF',
              textBorderWidth: 3,
            },
          },
        ],
      },
      { notMerge: true },
    )

    if (active) {
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 2,
        dataIndex: visited.findIndex((s) => s.id === active.id),
      })
    }

    const handleClick = (params: { data?: unknown }) => {
      const item = params?.data as { id?: string } | null | undefined
      if (item?.id) onSelect(item.id)
    }
    chart.on('click', handleClick)

    return () => {
      chart.off('click', handleClick)
    }
  }, [registered, stops, visited, planned, activeId, onSelect])

  const activeStop = stops.find((s) => s.id === activeId) ?? null
  const activeMemory = activeStop
    ? memories.find((m) => m.place.includes(activeStop.name))
    : undefined

  const provinces = new Set(visited.map((s) => s.province).filter(Boolean)).size

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-paper-line bg-white/55">
        <div
          ref={containerRef}
          className="h-[380px] w-full sm:h-[480px] lg:h-[560px]"
          role="img"
          aria-label={`中国旅行地图，已点亮 ${visited.length} 座城市`}
        />
        {!registered && (
          <p className="px-6 pb-6 text-center text-sm text-ink-soft">
            地图数据加载失败，请确认 public/china.json 存在
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap gap-2">
            {stops.map((stop, index) => (
              <button
                key={stop.id}
                type="button"
                onClick={() => onSelect(stop.id)}
                className={cn(
                  'cursor-pointer rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-200',
                  stop.id === activeId
                    ? 'border-rose bg-rose text-paper'
                    : stop.status === 'visited'
                      ? 'border-paper-line bg-white/70 text-ink hover:border-rose hover:text-rose'
                      : 'border-teal/40 border-dashed bg-white/50 text-teal hover:bg-teal/10',
                )}
              >
                <span className="tabular-nums opacity-60">{index + 1}.</span> {stop.name}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose" aria-hidden />
              走过 {visited.length} 座城市
            </span>
            <span className="inline-flex items-center gap-2">
              <Route className="h-4 w-4 text-gold" aria-hidden />
              点亮 {provinces} 个省份
            </span>
            <span className="inline-flex items-center gap-2">
              <Navigation className="h-4 w-4 text-teal" aria-hidden />
              计划中 {planned.length} 站
            </span>
          </div>
        </div>

        <aside className="rounded-2xl border border-paper-line bg-white/70 p-5">
          {activeStop ? (
            <>
              <p className="text-xs tracking-[0.3em] text-ink-soft">
                {formatShortDate(activeStop.date)}
              </p>
              <h3 className="mt-2 font-script text-2xl text-ink">{activeStop.name}</h3>
              <p className="mt-2 text-sm text-ink-soft">{activeStop.note}</p>
              {activeMemory && (
                <p className="mt-4 border-t border-paper-line pt-4 text-sm leading-relaxed text-ink/80">
                  「{activeMemory.title}」
                </p>
              )}
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="mt-4 cursor-pointer text-xs tracking-[0.2em] text-ink-soft transition-colors duration-200 hover:text-rose"
              >
                取消选中
              </button>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-ink-soft">
              点击地图上的圆点，或上方的城市名字，看看那一次我们在那里发生了什么。
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}
