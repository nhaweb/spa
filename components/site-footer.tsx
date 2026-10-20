import Link from 'next/link'
import { site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr_1fr] md:px-12">
        <div>
          <p className="font-serif text-3xl tracking-[-0.04em]">
            {site.name}
            <span className="text-primary">.</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {site.tagline}.
          </p>
        </div>
        <div className="text-sm leading-relaxed">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Giờ mở cửa</p>
          <p className="mt-3">
            {site.hoursLabel}
            <br />
            {site.hoursTime}
          </p>
          <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Liên hệ</p>
          <p className="mt-3">
            {site.addressLines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
            <a
              href={site.phoneHref}
              className="mt-2 inline-block border-b border-foreground/30 pb-0.5 transition-opacity duration-300 hover:opacity-60"
            >
              {site.phone}
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-3 text-[11px] uppercase tracking-[0.18em]">
          <Link href="/faq" className="w-fit transition-opacity duration-300 hover:opacity-60">
            Câu hỏi thường gặp
          </Link>
          <Link href="/lien-he" className="w-fit transition-opacity duration-300 hover:opacity-60">
            Liên hệ
          </Link>
          <Link href="/dat-lich" className="w-fit transition-opacity duration-300 hover:opacity-60">
            Đặt lịch
          </Link>
          <a
            href={site.instagram}
            className="w-fit transition-opacity duration-300 hover:opacity-60"
            rel="noreferrer"
          >
            Instagram ↗
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-6 py-6 text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-12">
        <span>
          © {site.year} {site.name} studio
        </span>
        <span>Da · Cơ thể · Yên tĩnh</span>
      </div>
    </footer>
  )
}
