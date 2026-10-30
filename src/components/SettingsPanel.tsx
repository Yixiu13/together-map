import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import {
  Download,
  ImagePlus,
  Info,
  MapPinPlus,
  PenLine,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { cityCoords } from '@/data/cityCoords'
import { defaultData } from '@/data/defaults'
import { cn } from '@/lib/utils'
import type { SiteDataStore } from '@/store/useSiteData'
import type { MemoryEntry, SceneKey, SiteData, StopStatus, TravelStop } from '@/types'

const INPUT =
  'w-full rounded-lg border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink-soft/45 focus:border-rose'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  store: SiteDataStore
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.2em] text-ink-soft">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function SubTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-8 border-b border-paper-line pb-2 font-script text-xl text-ink first:mt-0">
      {children}
    </h3>
  )
}

function exportJson(data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = '我们的旅行回忆录.json'
  link.click()
  URL.revokeObjectURL(url)
}

export function SettingsPanel({ open, onClose, store }: SettingsPanelProps) {
  const { data, update, addStop, updateStop, removeStop, addMemory, updateMemory, removeMemory, reset, replace } =
    store
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const applyCity = (stop: TravelStop, cityName: string) => {
    const city = cityCoords.find((c) => c.name === cityName)
    if (!city) return
    updateStop(stop.id, {
      name: city.name,
      province: city.province,
      lng: city.lng,
      lat: city.lat,
    })
  }

  const handleImport = async (file?: File) => {
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text()) as Partial<SiteData>
      replace({ ...defaultData, ...parsed })
    } catch {
      window.alert('这个文件读不出来，请确认是本站点导出的 JSON')
    }
  }

  return (
    <div
      className={cn('fixed inset-0 z-50', !open && 'pointer-events-none')}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="关闭编辑面板"
        onClick={onClose}
        className={cn(
          'absolute inset-0 cursor-default bg-ink/35 backdrop-blur-[2px] transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-paper-line bg-paper shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b border-paper-line px-6 py-5">
          <div>
            <p className="text-[11px] tracking-[0.35em] text-ink-soft">EDIT MEMOIR</p>
            <h2 className="mt-1 font-script text-2xl text-ink">书写回忆</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="cursor-pointer rounded-full border border-paper-line p-2 text-ink-soft transition-colors duration-200 hover:border-rose hover:text-rose"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex items-start gap-2 border-b border-paper-line bg-paper-deep/40 px-6 py-2.5 text-[11px] leading-relaxed text-ink-soft">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose" aria-hidden />
          <span>
            这里的修改只保存在本机浏览器，会盖过线上内容。
            <button
              type="button"
              onClick={() => {
                if (window.confirm('将丢弃本机的修改，改用站点最新内容？')) reset()
              }}
              className="ml-1 cursor-pointer text-rose underline decoration-rose/40 underline-offset-2 transition-colors duration-200 hover:decoration-rose"
            >
              加载站点最新内容
            </button>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Field label="在一起的那一天">
            <input
              type="date"
              value={data.startDate}
              onChange={(e) => update('startDate', e.target.value)}
              className={INPUT}
            />
          </Field>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="我们的称呼">
              <input
                value={data.names}
                onChange={(e) => update('names', e.target.value)}
                className={INPUT}
                placeholder="阿泽 & 小满"
              />
            </Field>
            <Field label="册子名">
              <input
                value={data.title}
                onChange={(e) => update('title', e.target.value)}
                className={INPUT}
                placeholder="同行记"
              />
            </Field>
          </div>

          <Field label="副标题">
            <input
              value={data.subtitle}
              onChange={(e) => update('subtitle', e.target.value)}
              className={`${INPUT} mt-4`}
            />
          </Field>

          <SubTitle>卷首语</SubTitle>
          <textarea
            value={data.prologue}
            onChange={(e) => update('prologue', e.target.value)}
            rows={4}
            className={`${INPUT} mt-3 resize-y leading-relaxed`}
          />

          <SubTitle>结束语</SubTitle>
          <textarea
            value={data.epilogue}
            onChange={(e) => update('epilogue', e.target.value)}
            rows={3}
            className={`${INPUT} mt-3 resize-y leading-relaxed`}
          />
          <Field label="署名">
            <input
              value={data.signature}
              onChange={(e) => update('signature', e.target.value)}
              className={`${INPUT} mt-3`}
            />
          </Field>

          <SubTitle>
            <span className="inline-flex items-center gap-2">
              <MapPinPlus className="h-4 w-4 text-teal" aria-hidden />
              旅行站点（{data.stops.length}）
            </span>
          </SubTitle>

          <div className="mt-3 space-y-3">
            {data.stops.map((stop, index) => (
              <div
                key={stop.id}
                className="rounded-xl border border-paper-line bg-white/70 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-[0.2em] text-ink-soft">
                    站点 {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeStop(stop.id)}
                    aria-label={`删除站点 ${stop.name}`}
                    className="cursor-pointer rounded-md p-1.5 text-ink-soft transition-colors duration-200 hover:text-rose"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <select
                  value=""
                  onChange={(e) => applyCity(stop, e.target.value)}
                  className={`${INPUT} mt-3 cursor-pointer`}
                >
                  <option value="">— 从常用城市一键填充 —</option>
                  {cityCoords.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}（{city.province}）
                    </option>
                  ))}
                </select>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input
                    value={stop.name}
                    onChange={(e) => updateStop(stop.id, { name: e.target.value })}
                    className={INPUT}
                    placeholder="城市名"
                  />
                  <input
                    value={stop.province}
                    onChange={(e) => updateStop(stop.id, { province: e.target.value })}
                    className={INPUT}
                    placeholder="省份"
                  />
                  <input
                    type="date"
                    value={stop.date}
                    onChange={(e) => updateStop(stop.id, { date: e.target.value })}
                    className={INPUT}
                  />
                  <select
                    value={stop.status}
                    onChange={(e) =>
                      updateStop(stop.id, { status: e.target.value as StopStatus })
                    }
                    className={`${INPUT} cursor-pointer`}
                  >
                    <option value="visited">已去过</option>
                    <option value="planned">计划中</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    value={stop.lng}
                    onChange={(e) => updateStop(stop.id, { lng: Number(e.target.value) })}
                    className={INPUT}
                    placeholder="经度"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={stop.lat}
                    onChange={(e) => updateStop(stop.id, { lat: Number(e.target.value) })}
                    className={INPUT}
                    placeholder="纬度"
                  />
                </div>

                <input
                  value={stop.note}
                  onChange={(e) => updateStop(stop.id, { note: e.target.value })}
                  className={`${INPUT} mt-2`}
                  placeholder="一句话注脚"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addStop}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-teal/50 py-2.5 text-sm text-teal transition-colors duration-200 hover:bg-teal/5"
          >
            <Plus className="h-4 w-4" aria-hidden />
            添加一个站点
          </button>

          <SubTitle>
            <span className="inline-flex items-center gap-2">
              <PenLine className="h-4 w-4 text-rose" aria-hidden />
              回忆章节（{data.memories.length}）
            </span>
          </SubTitle>

          <div className="mt-3 space-y-3">
            {data.memories.map((memory: MemoryEntry) => (
              <div
                key={memory.id}
                className="rounded-xl border border-paper-line bg-white/70 p-4"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="date"
                    value={memory.date}
                    onChange={(e) => updateMemory(memory.id, { date: e.target.value })}
                    className={`${INPUT} w-40`}
                  />
                  <button
                    type="button"
                    onClick={() => removeMemory(memory.id)}
                    aria-label="删除这一章"
                    className="cursor-pointer rounded-md p-1.5 text-ink-soft transition-colors duration-200 hover:text-rose"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <input
                  value={memory.title}
                  onChange={(e) => updateMemory(memory.id, { title: e.target.value })}
                  className={`${INPUT} mt-2`}
                  placeholder="章节标题"
                />

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    value={memory.place}
                    onChange={(e) => updateMemory(memory.id, { place: e.target.value })}
                    className={INPUT}
                    placeholder="地点"
                  />
                  <input
                    value={memory.weather}
                    onChange={(e) => updateMemory(memory.id, { weather: e.target.value })}
                    className={INPUT}
                    placeholder="天气 · 温度"
                  />
                </div>

                <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
                  <input
                    value={memory.photo}
                    onChange={(e) => updateMemory(memory.id, { photo: e.target.value })}
                    className={INPUT}
                    placeholder="照片地址（留空用内置插画）"
                  />
                  <a
                    href={memory.photo || '#'}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="预览照片"
                    className="inline-flex items-center justify-center rounded-lg border border-paper-line px-3 text-ink-soft transition-colors duration-200 hover:border-rose hover:text-rose"
                  >
                    <ImagePlus className="h-4 w-4" />
                  </a>
                </div>

                <select
                  value={memory.scene}
                  onChange={(e) =>
                    updateMemory(memory.id, { scene: e.target.value as SceneKey })
                  }
                  className={`${INPUT} mt-2 cursor-pointer`}
                >
                  <option value="mountain">山峦</option>
                  <option value="sea">海边</option>
                  <option value="city">城市</option>
                  <option value="snow">雪景</option>
                  <option value="town">古镇</option>
                  <option value="lake">湖畔</option>
                  <option value="food">烟火</option>
                  <option value="night">夜色</option>
                </select>

                <textarea
                  value={memory.body}
                  onChange={(e) => updateMemory(memory.id, { body: e.target.value })}
                  rows={5}
                  className={`${INPUT} mt-2 resize-y leading-relaxed`}
                  placeholder="写下这一章的故事…"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addMemory}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-rose/50 py-2.5 text-sm text-rose transition-colors duration-200 hover:bg-rose/5"
          >
            <Plus className="h-4 w-4" aria-hidden />
            写一章新的回忆
          </button>
        </div>

        <footer className="border-t border-paper-line px-6 py-4">
          <p className="mb-3 text-center text-[11px] text-ink-soft">
            修改会自动保存在这台设备的浏览器里
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => exportJson(data)}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-paper-line bg-white/70 py-2.5 text-xs text-ink transition-colors duration-200 hover:border-rose hover:text-rose"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              导出
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-paper-line bg-white/70 py-2.5 text-xs text-ink transition-colors duration-200 hover:border-rose hover:text-rose"
            >
              <Upload className="h-3.5 w-3.5" aria-hidden />
              导入
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('确定恢复成示例内容吗？当前编辑的内容会丢失。')) reset()
              }}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-paper-line bg-white/70 px-3 py-2.5 text-xs text-ink-soft transition-colors duration-200 hover:border-rose hover:text-rose"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              void handleImport(e.target.files?.[0])
              e.target.value = ''
            }}
          />
        </footer>
      </aside>
    </div>
  )
}
