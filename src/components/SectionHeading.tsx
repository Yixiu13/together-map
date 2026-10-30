interface SectionHeadingProps {
  en: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ en, title, subtitle, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <p className="text-[11px] tracking-[0.45em] text-ink-soft">{en}</p>
      <h2 className="mt-3 font-script text-4xl text-ink sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{subtitle}</p>}
      <span
        aria-hidden
        className={`mt-5 block h-px w-24 bg-rose/50 ${align === 'center' ? 'mx-auto' : ''}`}
      />
    </div>
  )
}
