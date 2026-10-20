'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { isValidVnPhone } from '@/lib/phone'
import { formatDuration, formatVnd, services, type Service } from '@/lib/services'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

type Step = 1 | 2 | 3
type Phase = 'form' | 'submitting' | 'success' | 'error'
type FieldKey = 'name' | 'phone'
type FieldErrors = Partial<Record<FieldKey, string>>

function formatSlotLabel(iso: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function nextOpenDateIso() {
  const d = new Date()
  for (let i = 0; i < 14; i++) {
    const trial = new Date(d)
    trial.setDate(d.getDate() + i)
    if (site.openDays.includes(trial.getDay())) {
      const y = trial.getFullYear()
      const m = String(trial.getMonth() + 1).padStart(2, '0')
      const day = String(trial.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }
  }
  return d.toISOString().slice(0, 10)
}

const openMinutes = (site.closeHour - site.openHour) * 60

function validateStep3(name: string, phone: string): FieldErrors {
  const errors: FieldErrors = {}
  const trimmedName = name.trim()
  const trimmedPhone = phone.trim()

  if (!trimmedName) {
    errors.name = 'Vui lòng nhập họ và tên.'
  } else if (trimmedName.length < 2) {
    errors.name = 'Họ và tên cần ít nhất 2 ký tự.'
  }

  if (!trimmedPhone) {
    errors.phone = 'Vui lòng nhập số điện thoại.'
  } else if (!isValidVnPhone(trimmedPhone)) {
    errors.phone = 'Số điện thoại chưa đúng. Vui lòng dùng số Việt Nam, ví dụ 0901234567.'
  }

  return errors
}

function RequiredMark() {
  return (
    <span className="ml-0.5 text-destructive" aria-hidden="true">
      *
    </span>
  )
}

export function BookingForm({ initialService }: { initialService?: string }) {
  const initial = services.find((s) => s.slug === initialService) ?? null
  const [step, setStep] = useState<Step>(1)
  const [selected, setSelected] = useState<Service[]>(initial ? [initial] : [])
  const [date, setDate] = useState(nextOpenDateIso)
  const [slots, setSlots] = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [startsAt, setStartsAt] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [phase, setPhase] = useState<Phase>('form')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState('')

  const totalMin = selected.reduce((sum, service) => sum + service.durationMin, 0)
  const totalPrice = selected.reduce((sum, service) => sum + service.priceVnd, 0)
  const tooLong = totalMin > openMinutes
  const selectedKey = selected.map((service) => service.slug).join(',')

  function toggleService(service: Service) {
    setSelected((current) =>
      current.some((item) => item.slug === service.slug)
        ? current.filter((item) => item.slug !== service.slug)
        : [...current, service],
    )
  }

  function clearFieldError(key: FieldKey) {
    setFieldErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  useEffect(() => {
    if (!selectedKey || !date || tooLong) {
      setSlots([])
      setStartsAt('')
      setSlotsLoading(false)
      return
    }
    let cancelled = false
    setSlotsLoading(true)
    setStartsAt('')
    fetch(`/api/slots?date=${encodeURIComponent(date)}&services=${encodeURIComponent(selectedKey)}`)
      .then(async (r) => {
        const data = (await r.json()) as { ok?: boolean; slots?: string[] }
        if (cancelled) return
        setSlots(Array.isArray(data.slots) ? data.slots : [])
      })
      .catch(() => {
        if (!cancelled) setSlots([])
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedKey, date, tooLong])

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])

  async function submit() {
    setSubmitError('')
    const errors = validateStep3(name, phone)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      const first = errors.name ? 'name' : 'phone'
      document.getElementById(`booking-${first}`)?.focus()
      return
    }
    if (selected.length === 0 || !startsAt) {
      setSubmitError('Vui lòng chọn liệu trình và khung giờ.')
      return
    }

    setFieldErrors({})
    setPhase('submitting')
    setError('')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlugs: selected.map((service) => service.slug),
          startsAt,
          customerName: name,
          customerPhone: phone,
          note,
        }),
      })
      const data = (await res.json()) as { ok: boolean; message?: string; code?: string }
      if (!data.ok) {
        const message = data.message ?? 'Không gửi được yêu cầu.'
        // Keep user on step 3 for field validation; full error screen for slot/server issues
        if (data.code === 'validation') {
          setPhase('form')
          if (/điện thoại|phone/i.test(message)) {
            setFieldErrors({ phone: message })
            document.getElementById('booking-phone')?.focus()
          } else if (/họ và tên|họ tên|tên/i.test(message)) {
            setFieldErrors({ name: message })
            document.getElementById('booking-name')?.focus()
          } else {
            setSubmitError(message)
          }
          return
        }
        setPhase('error')
        setError(message)
        return
      }
      setPhase('success')
    } catch {
      setPhase('error')
      setError('Mất kết nối mạng. Kiểm tra rồi thử lại, hoặc gọi trực tiếp studio.')
    }
  }

  if (phase === 'success' && selected.length > 0) {
    return (
      <div className="border border-border bg-secondary px-6 py-10 md:px-10">
        <p className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">Đã nhận yêu cầu.</p>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          Lịch của bạn đang <strong className="font-medium text-foreground">chờ xác nhận</strong>.
          Studio sẽ gọi số {phone} để chốt giờ cho{' '}
          {selected.map((service) => service.name).join(', ')}.
        </p>
        <div className="mt-10 flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.18em]">
          <Link href="/" className="border-b border-foreground pb-1">
            Về trang chủ
          </Link>
          <Link href="/dich-vu" className="text-muted-foreground underline underline-offset-4">
            Xem dịch vụ
          </Link>
        </div>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="border border-border px-6 py-10 md:px-10">
        <p className="font-serif text-4xl tracking-[-0.04em]">Chưa gửi được.</p>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">{error}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setPhase('form')}
            className="bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-primary-foreground"
          >
            Thử lại
          </button>
          <a
            href={site.phoneHref}
            className="border-b border-foreground pb-1 text-[11px] uppercase tracking-[0.18em]"
          >
            Gọi {site.phone}
          </a>
        </div>
      </div>
    )
  }

  const nameInvalid = Boolean(fieldErrors.name)
  const phoneInvalid = Boolean(fieldErrors.phone)

  return (
    <div className="border border-border">
      <div className="flex border-b border-border text-[10px] uppercase tracking-[0.18em]">
        {[
          [1, 'Liệu trình'],
          [2, 'Thời gian'],
          [3, 'Thông tin'],
        ].map(([n, label]) => (
          <div
            key={n}
            className={cn(
              'flex-1 px-4 py-4 md:px-6',
              step === n ? 'bg-secondary text-foreground' : 'text-muted-foreground',
            )}
          >
            {n}. {label}
          </div>
        ))}
      </div>

      <div className="px-6 py-8 md:px-10 md:py-10">
        {step === 1 && (
          <div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Chọn một hoặc nhiều liệu trình. Các liệu trình sẽ được xếp liền nhau trong cùng một
              buổi.
            </p>
            <div className="mt-6 border-t border-foreground">
              {services.map((s) => {
                const on = selected.some((item) => item.slug === s.slug)
                return (
                  <button
                    key={s.slug}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleService(s)}
                    className={cn(
                      'grid w-full grid-cols-[1fr_auto] items-center gap-4 border-b border-border py-6 text-left transition-colors hover:bg-secondary md:grid-cols-[1fr_120px_120px] md:px-3',
                      on && 'bg-secondary',
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={cn(
                          'mt-1 flex size-5 shrink-0 items-center justify-center border',
                          on
                            ? 'border-foreground bg-primary text-primary-foreground'
                            : 'border-border bg-background',
                        )}
                      >
                        {on && <Check size={12} />}
                      </span>
                      <div>
                        <p className="font-serif text-2xl tracking-[-0.03em]">{s.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{s.summary}</p>
                      </div>
                    </div>
                    <span className="hidden text-xs text-muted-foreground md:block">
                      {formatDuration(s.durationMin)}
                    </span>
                    <span className="text-sm">{formatVnd(s.priceVnd)}</span>
                  </button>
                )
              })}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {selected.length === 0
                  ? 'Chưa chọn liệu trình'
                  : `${selected.length} liệu trình · ${formatDuration(totalMin)} · ${formatVnd(totalPrice)}`}
              </p>
              <button
                type="button"
                disabled={selected.length === 0 || tooLong}
                onClick={() => setStep(2)}
                className="bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-40"
              >
                Tiếp tục
              </button>
            </div>
            {tooLong && (
              <p className="mt-4 text-sm text-foreground" role="alert">
                Tổng thời lượng vượt quá giờ mở cửa. Vui lòng bỏ bớt liệu trình để đặt trong một lần.
              </p>
            )}
          </div>
        )}

        {step === 2 && selected.length > 0 && (
          <div>
            <p className="font-serif text-3xl tracking-[-0.04em]">
              {selected.length === 1 ? selected[0].name : `${selected.length} liệu trình`}
            </p>
            <ul className="mt-4 max-w-md space-y-2">
              {selected.map((service) => (
                <li key={service.slug} className="flex items-baseline justify-between gap-4 text-sm">
                  <span>{service.name}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {formatDuration(service.durationMin)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Tổng {formatDuration(totalMin)} · {formatVnd(totalPrice)}. Cần một khung giờ trống liên
              tục.
            </p>

            <label className="mt-10 block text-[10px] uppercase tracking-[0.18em]">
              Ngày
              <input
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full max-w-xs border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground"
              />
            </label>

            <p className="mt-8 text-[10px] uppercase tracking-[0.18em]">Khung giờ trống</p>
            {slotsLoading && (
              <p className="mt-4 text-sm text-muted-foreground">Đang tải khung giờ…</p>
            )}
            {!slotsLoading && slots.length === 0 && (
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Ngày này không còn khung giờ trống, hoặc studio đang đóng cửa. Vui lòng chọn ngày
                khác (Thứ Ba — Thứ Bảy).
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {slots.map((iso) => (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setStartsAt(iso)}
                  className={cn(
                    'border px-4 py-2 text-sm transition-colors',
                    startsAt === iso
                      ? 'border-foreground bg-primary text-primary-foreground'
                      : 'border-border hover:bg-secondary',
                  )}
                >
                  {formatSlotLabel(iso)}
                </button>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground underline underline-offset-4"
              >
                Đổi liệu trình
              </button>
              <button
                type="button"
                disabled={!startsAt}
                onClick={() => setStep(3)}
                className="bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-40"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {step === 3 && selected.length > 0 && (
          <div>
            <p className="font-serif text-3xl tracking-[-0.04em]">Thông tin của bạn</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {selected.map((service) => service.name).join(' · ')}
              {startsAt &&
                ` · ${new Intl.DateTimeFormat('vi-VN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(startsAt))}`}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tổng {formatDuration(totalMin)} · {formatVnd(totalPrice)}
            </p>

            <form
              className="mt-10 max-w-md space-y-6"
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                void submit()
              }}
            >
              <div>
                <label
                  htmlFor="booking-name"
                  className="block text-[10px] uppercase tracking-[0.18em]"
                >
                  Họ và tên
                  <RequiredMark />
                </label>
                <input
                  id="booking-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    clearFieldError('name')
                  }}
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={nameInvalid}
                  aria-describedby={nameInvalid ? 'booking-name-error' : undefined}
                  className={cn(
                    'mt-2 w-full border bg-transparent px-3 py-3 text-sm outline-none transition-colors',
                    nameInvalid
                      ? 'border-destructive focus:border-destructive'
                      : 'border-border focus:border-foreground',
                  )}
                />
                {nameInvalid && (
                  <p id="booking-name-error" className="mt-2 text-sm text-destructive" role="alert">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-phone"
                  className="block text-[10px] uppercase tracking-[0.18em]"
                >
                  Số điện thoại
                  <RequiredMark />
                </label>
                <input
                  id="booking-phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    clearFieldError('phone')
                  }}
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  aria-required="true"
                  aria-invalid={phoneInvalid}
                  aria-describedby={phoneInvalid ? 'booking-phone-error' : undefined}
                  placeholder="0901234567"
                  className={cn(
                    'mt-2 w-full border bg-transparent px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60',
                    phoneInvalid
                      ? 'border-destructive focus:border-destructive'
                      : 'border-border focus:border-foreground',
                  )}
                />
                {phoneInvalid && (
                  <p id="booking-phone-error" className="mt-2 text-sm text-destructive" role="alert">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-note"
                  className="block text-[10px] uppercase tracking-[0.18em]"
                >
                  Ghi chú <span className="normal-case tracking-normal text-muted-foreground">(tuỳ chọn)</span>
                </label>
                <textarea
                  id="booking-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-2 w-full resize-none border border-border bg-transparent px-3 py-3 text-sm outline-none transition-colors focus:border-foreground"
                />
              </div>

              {submitError && (
                <p className="text-sm text-destructive" role="alert">
                  {submitError}
                </p>
              )}

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground underline underline-offset-4"
                >
                  Đổi giờ
                </button>
                <button
                  type="submit"
                  disabled={phase === 'submitting'}
                  className="group flex items-center gap-2 bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-50"
                >
                  {phase === 'submitting' ? 'Đang gửi…' : 'Gửi yêu cầu đặt lịch'}
                  {phase !== 'submitting' && <Check size={14} />}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-secondary px-6 py-5 text-xs leading-relaxed text-muted-foreground md:px-10">
        Sau khi gửi, lịch sẽ ở trạng thái chờ xác nhận. Cần hỗ trợ ngay?{' '}
        <a href={site.phoneHref} className="text-foreground underline underline-offset-2">
          {site.phone}
        </a>
        {' · '}
        <Link href="/faq" className="inline-flex items-center gap-1 text-foreground underline underline-offset-2">
          Câu hỏi thường gặp <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  )
}
