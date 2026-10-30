import { lazy, Suspense, useState } from 'react'
import { CountdownSection } from '@/components/CountdownSection'
import { Hero } from '@/components/Hero'
import { LetterSection } from '@/components/LetterSection'
import { MemoirTimeline } from '@/components/MemoirTimeline'
import { MilestoneRail } from '@/components/MilestoneRail'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { SettingsPanel } from '@/components/SettingsPanel'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { formatDate } from '@/lib/utils'
import { useSiteData } from '@/store/useSiteData'

const MemoryMap = lazy(() =>
  import('@/components/MemoryMap').then((module) => ({ default: module.MemoryMap })),
)

export default function App() {
  const store = useSiteData()
  const { data, sortedMemories, sortedStops } = store
  const [activeStopId, setActiveStopId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <SiteNav title={data.title} onEdit={() => setPanelOpen(true)} />

      <main>
        <Hero data={data} />

        <section id="prologue" className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
          <LetterSection
            verticalLabel="写在前面"
            title="卷首 · 序"
            body={data.prologue}
            signature={data.signature}
            dateLabel={formatDate(data.startDate)}
          />
        </section>

        <CountdownSection data={data} />

        <section id="map" className="bg-paper-deep/30 py-24">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
            <Reveal>
              <SectionHeading
                en="TRAVEL MAP"
                title="我们的中国地图"
                subtitle="每一枚圆点，都是我们一起站过的地方。虚线是还没抵达的约定。"
              />
            </Reveal>
            <Reveal delay={120} className="mt-12">
              <Suspense
                fallback={
                  <div className="flex h-[380px] items-center justify-center rounded-2xl border border-paper-line bg-white/50 text-sm text-ink-soft sm:h-[480px] lg:h-[560px]">
                    地图正在慢慢展开…
                  </div>
                }
              >
                <MemoryMap
                  stops={sortedStops}
                  memories={sortedMemories}
                  activeId={activeStopId}
                  onSelect={setActiveStopId}
                />
              </Suspense>
            </Reveal>
          </div>
        </section>

        <section id="memoir" className="relative py-24">
          <div className="paper-grain pointer-events-none absolute inset-0 opacity-[0.12]" />
          <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10">
            <Reveal>
              <SectionHeading
                en="THE MEMOIR"
                title="回忆录"
                subtitle="按时间排好的九个章节，从第 一 天到现在。"
                align="center"
              />
            </Reveal>
            <div className="mt-16">
              <MemoirTimeline memories={sortedMemories} />
            </div>
          </div>
        </section>

        <section id="milestones" className="bg-paper-deep/30 py-24">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
            <Reveal>
              <SectionHeading
                en="MILESTONES"
                title="纪念日"
                subtitle="一百天、一周年、一千天……每一个都还在往前走。"
              />
            </Reveal>
            <Reveal delay={120} className="mt-12">
              <MilestoneRail startDate={data.startDate} />
            </Reveal>
          </div>
        </section>

        <section id="epilogue" className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
          <LetterSection
            verticalLabel="写在后面"
            title="卷尾 · 未完"
            body={data.epilogue}
            signature={data.signature}
          />
        </section>
      </main>

      <SiteFooter names={data.names} startDate={data.startDate} />

      <SettingsPanel open={panelOpen} onClose={() => setPanelOpen(false)} store={store} />
    </div>
  )
}
