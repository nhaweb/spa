'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navLinks, site } from '@/lib/site'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="hero-enter relative z-50 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-12">
      <Link
        href="/"
        className="font-serif text-2xl tracking-[-0.04em] transition-opacity duration-300 hover:opacity-70"
        onClick={() => setOpen(false)}
      >
        {site.name}
        <span className="text-primary">.</span>
      </Link>

      <nav className="hidden items-center gap-7 text-[10px] uppercase tracking-[0.2em] lg:flex">
        {navLinks.map((link) => {
          const active =
            link.href === '/'
              ? pathname === '/'
              : pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative pb-1 transition-opacity duration-300 hover:opacity-60',
                active ? 'opacity-100' : 'opacity-80',
              )}
            >
              {link.label}
              <span
                className={cn(
                  'absolute bottom-0 left-0 h-px bg-foreground transition-[width] duration-400 ease-out',
                  active ? 'w-full' : 'w-0',
                )}
                aria-hidden
              />
            </Link>
          )
        })}
      </nav>

      <Link
        href="/dat-lich"
        className="link-underline hidden text-[10px] uppercase tracking-[0.2em] md:block"
      >
        Đặt lịch
      </Link>

      <button
        type="button"
        aria-label={open ? 'Đóng menu' : 'Mở menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="transition-transform duration-300 active:scale-95 lg:hidden"
      >
        {open ? <X size={22} strokeWidth={1.4} /> : <Menu size={22} strokeWidth={1.4} />}
      </button>

      {open && (
        <div className="mobile-menu-enter absolute left-0 right-0 top-[72px] z-40 border-y border-border bg-background px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-5 text-xs uppercase tracking-[0.2em]">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="hero-enter transition-opacity duration-300 hover:opacity-60"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dat-lich"
              onClick={() => setOpen(false)}
              className="link-underline w-fit"
            >
              Đặt lịch
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
