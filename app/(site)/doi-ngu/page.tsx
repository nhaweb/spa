import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageIntro } from '@/components/page-intro'
import { Reveal } from '@/components/reveal'
import { therapists } from '@/lib/therapists'

export const metadata: Metadata = {
  title: 'Đội ngũ',
  description: 'Gặp đội ngũ chuyên viên da và massage tại studio mori.',
}

const variants = ['wipe-y', 'wipe', 'scale'] as const

export default function TeamPage() {
  return (
    <>
      <PageIntro
        title={
          <>
            Người đồng hành
            <br />
            <em className="font-light">trong từng buổi hẹn.</em>
          </>
        }
        description="Mỗi buổi hẹn đều có người đồng hành — lắng nghe, điều chỉnh và chăm sóc theo nhịp của bạn."
      />

      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pb-24 sm:grid-cols-2 md:grid-cols-3 md:gap-8 md:px-12">
        {therapists.map((t, i) => (
          <Reveal
            key={t.slug}
            delay={i * 120}
            variant={variants[i % variants.length]}
            as="article"
            className={i === 1 ? 'sm:pt-12' : undefined}
          >
            <div className="group relative aspect-[3/4] overflow-hidden bg-secondary">
              <Image src={t.image} alt={t.name} fill className="img-zoom object-cover" />
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <h2 className="font-serif text-2xl tracking-[-0.03em]">{t.name}</h2>
              <p className="text-xs text-muted-foreground">{t.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.bio}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal variant="skew" className="border-t border-border px-6 py-16 md:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="font-serif text-3xl tracking-[-0.03em]">Muốn chọn chuyên viên?</p>
          <Link
            href="/dat-lich"
            className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            Ghi chú khi đặt lịch <ArrowUpRight size={14} />
          </Link>
        </div>
      </Reveal>
    </>
  )
}
