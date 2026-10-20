import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { formatDuration, formatVnd, services } from '@/lib/services'
import { site } from '@/lib/site'

const teaser = services.slice(0, 3)
const rowVariants = ['left', 'right', 'soft'] as const

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-[1440px] gap-10 px-6 pb-20 pt-12 md:grid-cols-[1fr_0.82fr] md:items-end md:gap-20 md:px-12 md:pb-28 md:pt-20">
        <div>
          <h1 className="hero-enter max-w-[720px] font-serif text-[clamp(3.25rem,8.5vw,8rem)] leading-[0.9] tracking-[-0.04em] [word-break:keep-all]">
           Chăm sóc mình
            <br />
            <em className="font-light">theo cách dịu dàng nhất.</em>
          </h1>
          <p className="hero-enter hero-enter-delay-1 mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            Studio chăm sóc da và cơ thể — không gian yên, liệu trình rõ ràng, đặt lịch đơn giản.
          </p>
          <div className="hero-enter hero-enter-delay-2 mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/dat-lich"
              className="group flex items-center gap-3 bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              Đặt lịch
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href="/dich-vu"
              className="link-underline text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              Xem dịch vụ
            </Link>
          </div>
        </div>
        <div className="hero-image-enter relative ml-auto w-full max-w-[460px]">
          <div className="group relative aspect-[4/5] overflow-hidden">
            <Image
              src="/spa-hero.png"
              alt="Không gian spa yên tĩnh, ánh sáng tự nhiên"
              fill
              className="img-zoom object-cover"
              priority
            />
          </div>
          <p className="mt-4 max-w-[250px] text-xs leading-relaxed text-muted-foreground">
            {site.name} — liệu trình da, cơ thể và khoảng thời gian dành riêng cho bạn.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-secondary px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-24">
          <Reveal variant="left">
            <p className="font-serif text-2xl tracking-[-0.03em] md:text-3xl">
              Cách {site.name} chăm sóc
            </p>
          </Reveal>
          <Reveal variant="right" delay={160}>
            <p className="max-w-3xl font-serif text-3xl leading-[1.08] tracking-[-0.04em] md:text-5xl">
              Không vội. Không ồn. Chỉ những bước chăm sóc được cân nhắc kỹ — để bạn thư giãn thật
              sự.
            </p>
            <Link
              href="/ve-chung-toi"
              className="mt-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] link-underline"
            >
              Về chúng tôi <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        <Reveal variant="clip" className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-serif text-4xl tracking-[-0.04em] md:text-6xl">
            Một vài liệu trình nổi bật
          </h2>
          <Link
            href="/dich-vu"
            className="link-underline text-[11px] uppercase tracking-[0.18em]"
          >
            Xem tất cả
          </Link>
        </Reveal>
        <div className="border-t border-foreground">
          {teaser.map((s, i) => (
            <Reveal key={s.slug} delay={i * 110} variant={rowVariants[i % rowVariants.length]}>
              <Link
                href={`/dich-vu/${s.slug}`}
                className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border py-7 transition-colors duration-300 hover:bg-secondary md:grid-cols-[1fr_140px_120px] md:px-4 md:py-8"
              >
                <div>
                  <h3 className="font-serif text-2xl tracking-[-0.03em] transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground">{s.summary}</p>
                </div>
                <span className="hidden text-xs text-muted-foreground md:block">
                  {formatDuration(s.durationMin)}
                </span>
                <span className="text-sm">{formatVnd(s.priceVnd)}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal variant="down" delay={80}>
          <Link
            href="/dat-lich"
            className="mt-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] link-underline"
          >
            Đặt lịch ngay <ArrowUpRight size={14} />
          </Link>
        </Reveal>
      </section>

      <section className="border-y border-border bg-[#d9d0c0] px-6 py-20 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-[1440px] items-end gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <Reveal variant="wipe" className="group relative aspect-[16/10] overflow-hidden">
            <Image
              src="/spa-detail.png"
              alt="Chi tiết không gian và vật dụng tại studio"
              fill
              className="img-zoom object-cover"
            />
          </Reveal>
          <Reveal variant="blur" delay={180}>
            <h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
              Không gian
              <br />
              <em className="font-light">đủ để thở chậm.</em>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Ánh sáng dịu, góc nhỏ dành riêng cho bạn — tại {site.addressLines[1]}.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.18em]">
              <Link href="/doi-ngu" className="link-underline">
                Đội ngũ
              </Link>
              <Link href="/lien-he" className="link-underline">
                Liên hệ
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-primary px-6 py-20 text-primary-foreground md:px-12 md:py-24">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Reveal variant="skew" className="max-w-2xl">
            <h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.04em] md:text-6xl">
              Dành một khung giờ cho riêng mình.
            </h2>
          </Reveal>
          <Reveal variant="scale" delay={200}>
            <Link
              href="/dat-lich"
              className="inline-flex w-fit items-center gap-3 border border-primary-foreground/40 px-5 py-3 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 hover:bg-primary-foreground hover:text-primary hover:-translate-y-0.5"
            >
              Đặt lịch <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
