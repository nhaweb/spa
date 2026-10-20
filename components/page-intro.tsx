import type { ReactNode } from 'react'

type PageIntroProps = {
  title: ReactNode
  description?: string
  children?: ReactNode
}

export function PageIntro({ title, description, children }: PageIntroProps) {
  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-10 md:px-12 md:pb-16 md:pt-16">
      <h1 className="hero-enter max-w-4xl font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.04em]">
        {title}
      </h1>
      {description && (
        <p className="hero-enter hero-enter-delay-1 mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {children && <div className="hero-enter hero-enter-delay-2">{children}</div>}
    </div>
  )
}
