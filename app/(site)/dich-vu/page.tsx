import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageIntro } from '@/components/page-intro'
import { Reveal } from '@/components/reveal'
import { formatDuration, formatVnd, services } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Dịch vụ',
  description: 'Bảng liệu trình da, cơ thể và thư giãn tại studio mori.',
}

const variants = ['left', 'right', 'soft', 'blur'] as const

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        title={
          <>
            Các liệu trình
            <br />
            <em className="font-light">rõ ràng, dễ chọn.</em>
          </>
        }
        description="Chọn liệu trình phù hợp với da, cơ thể hoặc nhu cầu thư giãn của bạn. Xem chi tiết từng buổi hoặc đặt lịch ngay."
      />

      <div className="mx-auto max-w-[1440px] px-6 pb-24 md:px-12">
        <div className="border-t border-foreground">
          {services.map((s, i) => (
            <Reveal
              key={s.slug}
              delay={i * 80}
              variant={variants[i % variants.length]}
              className="grid gap-4 border-b border-border py-8 md:grid-cols-[64px_1fr_auto] md:items-center md:gap-6 md:px-3"
            >
              <span className="text-xs text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <Link href={`/dich-vu/${s.slug}`}>
                  <h2 className="font-serif text-3xl tracking-[-0.03em] transition-opacity duration-300 hover:opacity-70">
                    {s.name}
                  </h2>
                </Link>
                <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
                <p className="mt-3 text-xs text-muted-foreground md:hidden">
                  {formatDuration(s.durationMin)} · {formatVnd(s.priceVnd)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 md:flex-col md:items-end md:gap-3">
                <span className="hidden text-xs text-muted-foreground md:block">
                  {formatDuration(s.durationMin)}
                </span>
                <span className="hidden text-sm md:block">{formatVnd(s.priceVnd)}</span>
                <Link
                  href={`/dat-lich?service=${s.slug}`}
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] link-underline"
                >
                  Đặt lịch <ArrowUpRight size={14} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  )
}
