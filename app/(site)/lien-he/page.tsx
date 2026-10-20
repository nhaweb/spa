import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageIntro } from '@/components/page-intro'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Địa chỉ, giờ mở cửa và cách liên hệ studio mori.',
}

export default function ContactPage() {
  return (
    <>
      <PageIntro
        title={
          <>
            Ghé thăm
            <br />
            <em className="font-light">hoặc nhắn trước.</em>
          </>
        }
        description="Ghé studio hoặc nhắn trước qua điện thoại, Zalo hay email — chúng tôi luôn sẵn sàng hỗ trợ."
      />

      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pb-24 md:grid-cols-2 md:gap-20 md:px-12">
        <div className="space-y-10 text-sm leading-relaxed">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Địa chỉ</p>
            <p className="mt-3 font-serif text-3xl tracking-[-0.03em]">
              {site.addressLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <a
              href={site.mapLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] underline underline-offset-4"
            >
              Mở bản đồ <ArrowUpRight size={12} />
            </a>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Giờ mở cửa</p>
            <p className="mt-3">
              {site.hoursLabel}
              <br />
              {site.hoursTime}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Liên hệ</p>
            <a href={site.phoneHref} className="w-fit border-b border-foreground/40 pb-1">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="w-fit border-b border-foreground/40 pb-1">
              {site.email}
            </a>
            <a
              href={site.zalo}
              target="_blank"
              rel="noreferrer"
              className="w-fit border-b border-foreground/40 pb-1"
            >
              Zalo (tuỳ chọn)
            </a>
          </div>
          <Link
            href="/dat-lich"
            className="inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-primary-foreground"
          >
            Đặt lịch online <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="min-h-[320px] overflow-hidden border border-border bg-secondary">
          <iframe
            title="Bản đồ studio mori"
            src={site.mapEmbedUrl}
            className="h-full min-h-[320px] w-full border-0 grayscale"
            loading="lazy"
          />
        </div>
      </div>
    </>
  )
}
