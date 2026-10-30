import { Reveal } from '@/components/Reveal'
import { cn } from '@/lib/utils'

interface LetterSectionProps {
  verticalLabel: string
  title: string
  body: string
  signature?: string
  dateLabel?: string
  className?: string
}

export function LetterSection({
  verticalLabel,
  title,
  body,
  signature,
  dateLabel,
  className,
}: LetterSectionProps) {
  return (
    <Reveal
      className={cn(
        'relative mx-auto w-full max-w-3xl rounded-2xl border border-paper-line bg-white/70 px-8 py-12 shadow-[0_24px_60px_-40px_rgba(43,39,35,0.5)] sm:px-14 sm:py-16',
        className,
      )}
    >
      <span
        aria-hidden
        className="vertical-rl absolute -left-4 top-10 hidden select-none font-script text-lg tracking-[0.4em] text-rose/45 sm:block"
      >
        {verticalLabel}
      </span>

      <h2 className="font-script text-3xl text-ink sm:text-4xl">{title}</h2>

      <p className="mt-6 font-body text-[15px] leading-[2.3] text-ink/85 sm:text-base">{body}</p>

      {(signature || dateLabel) && (
        <div className="mt-10 flex flex-col items-end gap-1 text-sm text-ink-soft">
          <span className="font-script text-xl text-ink">{signature}</span>
          {dateLabel && <span className="text-xs tracking-[0.2em]">{dateLabel}</span>}
        </div>
      )}
    </Reveal>
  )
}
