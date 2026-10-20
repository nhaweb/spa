import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { formatDuration, formatVnd, getService, services } from '@/lib/services'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return { title: 'Dịch vụ' }
  return {
    title: service.name,
    description: service.summary,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  return (
    <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20 md:px-12 md:py-20">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <Image
          src="/spa-treatment.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-xs text-muted-foreground">
          {formatDuration(service.durationMin)} · {formatVnd(service.priceVnd)}
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-[-0.04em] md:text-7xl">{service.name}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{service.summary}</p>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">{service.detail}</p>
        <div className="mt-10 flex flex-wrap gap-6">
          <Link
            href={`/dat-lich?service=${service.slug}`}
            className="group inline-flex items-center gap-3 bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-primary-foreground"
          >
            Đặt lịch liệu trình này
            <ArrowUpRight size={14} />
          </Link>
          <Link
            href="/dich-vu"
            className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground underline underline-offset-4"
          >
            Tất cả dịch vụ
          </Link>
        </div>
      </div>
    </div>
  )
}
