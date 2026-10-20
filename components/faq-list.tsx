'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Faq } from '@/lib/faqs'
import { Reveal, type RevealVariant } from '@/components/reveal'

const variants: RevealVariant[] = ['left', 'right', 'soft', 'blur']

export function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="border-t border-foreground">
      {items.map((faq, index) => (
        <Reveal
          key={faq.question}
          delay={index * 70}
          variant={variants[index % variants.length]}
          className="border-b border-border"
        >
          <button
            type="button"
            onClick={() => setOpen(open === index ? null : index)}
            className="flex w-full items-center justify-between gap-4 py-6 text-left text-sm transition-colors duration-300 hover:text-primary"
            aria-expanded={open === index}
          >
            <span>{faq.question}</span>
            <ChevronDown
              size={16}
              className={`shrink-0 transition-transform duration-400 ${open === index ? 'rotate-180' : ''}`}
            />
          </button>
          {open === index && (
            <p className="faq-answer-enter max-w-lg pb-6 text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          )}
        </Reveal>
      ))}
    </div>
  )
}
