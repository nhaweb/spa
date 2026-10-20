'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type RevealVariant =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'fade'
  | 'scale'
  | 'blur'
  | 'clip'
  | 'wipe'
  | 'wipe-y'
  | 'skew'
  | 'soft'

const CLIP_VARIANTS = new Set<RevealVariant>(['clip', 'wipe', 'wipe-y'])

type RevealProps = {
  children: ReactNode
  className?: string
  /** Delay in ms before the reveal starts once visible */
  delay?: number
  /** Animation variant — mix directions/effects across the page */
  variant?: RevealVariant
  /** Animate only once (default) or every time it enters view */
  once?: boolean
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
  style?: CSSProperties
}

export function Reveal({
  children,
  className,
  delay = 0,
  variant = 'up',
  once = true,
  as: Tag = 'div',
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  const isClip = CLIP_VARIANTS.has(variant)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const delayStyle = visible ? `${delay}ms` : undefined

  // Clip/wipe must live on an INNER node — if clip-path hides the observed
  // element, IntersectionObserver never fires (intersection ≈ 0).
  if (isClip) {
    return (
      <Tag ref={ref as never} className="reveal-host" style={style}>
        <div
          className={cn('reveal', `reveal-${variant}`, visible && 'is-visible', className)}
          style={{ transitionDelay: delayStyle }}
        >
          {children}
        </div>
      </Tag>
    )
  }

  return (
    <Tag
      ref={ref as never}
      className={cn('reveal', `reveal-${variant}`, visible && 'is-visible', className)}
      style={{ ...style, transitionDelay: delayStyle }}
    >
      {children}
    </Tag>
  )
}
