import { promises as fs } from 'fs'
import path from 'path'
import { isValidVnPhone } from '@/lib/phone'
import { site } from '@/lib/site'
import { getService, type Service } from '@/lib/services'

export type AppointmentStatus = 'moi' | 'da-xac-nhan' | 'hoan-thanh' | 'huy'

export type BookedService = {
  slug: string
  name: string
  durationMin: number
  priceVnd: number
}

export type Appointment = {
  id: string
  serviceSlug: string
  serviceName: string
  services?: BookedService[]
  durationMin?: number
  priceVnd?: number
  startsAt: string // ISO
  customerName: string
  customerPhone: string
  note: string
  status: AppointmentStatus
  ownerNote: string
  createdAt: string
}

export type BookingPayload = {
  serviceSlug?: string
  serviceSlugs?: string[]
  startsAt: string
  customerName: string
  customerPhone: string
  note?: string
}

export type BookingResult =
  | { ok: true; appointment: Appointment }
  | {
      ok: false
      code: 'validation' | 'slot_full' | 'closed' | 'unknown_service' | 'server'
      message: string
    }

const dataPath = path.join(process.cwd(), 'data', 'appointments.json')

async function ensureFile() {
  try {
    await fs.access(dataPath)
  } catch {
    await fs.mkdir(path.dirname(dataPath), { recursive: true })
    await fs.writeFile(dataPath, '[]\n', 'utf8')
  }
}

export async function readAppointments(): Promise<Appointment[]> {
  await ensureFile()
  const raw = await fs.readFile(dataPath, 'utf8')
  try {
    const parsed = JSON.parse(raw) as Appointment[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeAppointments(items: Appointment[]) {
  await ensureFile()
  await fs.writeFile(dataPath, `${JSON.stringify(items, null, 2)}\n`, 'utf8')
}

function isOpenDay(date: Date) {
  return site.openDays.includes(date.getDay())
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd
}

export function generateSlotsForDate(dateIso: string, serviceDurationMin: number): string[] {
  const day = new Date(`${dateIso}T00:00:00`)
  if (Number.isNaN(day.getTime()) || !isOpenDay(day)) return []

  const slots: string[] = []
  for (let hour = site.openHour; hour < site.closeHour; hour++) {
    for (let minute = 0; minute < 60; minute += site.slotMinutes) {
      const start = new Date(day)
      start.setHours(hour, minute, 0, 0)
      const end = new Date(start.getTime() + serviceDurationMin * 60_000)
      const close = new Date(day)
      close.setHours(site.closeHour, 0, 0, 0)
      if (end <= close) {
        slots.push(start.toISOString())
      }
    }
  }
  return slots
}

function requestedSlugs(payload: Pick<BookingPayload, 'serviceSlug' | 'serviceSlugs'>) {
  const fromList = Array.isArray(payload.serviceSlugs) ? payload.serviceSlugs : []
  const raw = fromList.length > 0 ? fromList : payload.serviceSlug ? [payload.serviceSlug] : []
  return [...new Set(raw.map((slug) => String(slug).trim()).filter(Boolean))]
}

function resolveServices(slugs: string[]): Service[] | null {
  if (slugs.length === 0) return null
  const found = slugs.map((slug) => getService(slug))
  if (found.some((service) => !service)) return null
  return found as Service[]
}

function appointmentDuration(appointment: Appointment) {
  if (typeof appointment.durationMin === 'number' && appointment.durationMin > 0) {
    return appointment.durationMin
  }
  if (appointment.services?.length) {
    return appointment.services.reduce((sum, service) => sum + service.durationMin, 0)
  }
  return getService(appointment.serviceSlug)?.durationMin ?? 60
}

function blocks(start: Date, durationMin: number, active: Appointment[]) {
  const end = new Date(start.getTime() + durationMin * 60_000)
  return active.some((appointment) => {
    const otherStart = new Date(appointment.startsAt)
    const otherEnd = new Date(otherStart.getTime() + appointmentDuration(appointment) * 60_000)
    return overlaps(start, end, otherStart, otherEnd)
  })
}

export async function availableSlots(dateIso: string, serviceSlugs: string | string[]): Promise<string[]> {
  const slugs = requestedSlugs({
    serviceSlugs: Array.isArray(serviceSlugs) ? serviceSlugs : undefined,
    serviceSlug: Array.isArray(serviceSlugs) ? undefined : serviceSlugs,
  })
  const services = resolveServices(slugs)
  if (!services) return []

  const durationMin = services.reduce((sum, service) => sum + service.durationMin, 0)
  const all = generateSlotsForDate(dateIso, durationMin)
  const appointments = await readAppointments()
  const active = appointments.filter((appointment) => appointment.status !== 'huy')

  const now = Date.now()
  return all.filter((iso) => {
    const start = new Date(iso)
    if (start.getTime() < now) return false
    return !blocks(start, durationMin, active)
  })
}

export async function createAppointment(payload: BookingPayload): Promise<BookingResult> {
  try {
    const name = payload.customerName?.trim()
    const phone = payload.customerPhone?.trim()
    const note = payload.note?.trim() ?? ''
    const slugs = requestedSlugs(payload)
    const services = resolveServices(slugs)

    if (!name || name.length < 2) {
      return { ok: false, code: 'validation', message: 'Vui lòng nhập họ và tên (ít nhất 2 ký tự).' }
    }
    if (!phone || !isValidVnPhone(phone)) {
      return {
        ok: false,
        code: 'validation',
        message: 'Số điện thoại chưa đúng. Vui lòng dùng số Việt Nam, ví dụ 0901234567.',
      }
    }
    if (slugs.length === 0) {
      return { ok: false, code: 'validation', message: 'Vui lòng chọn ít nhất một liệu trình.' }
    }
    if (!services) {
      return { ok: false, code: 'unknown_service', message: 'Một trong các liệu trình đã chọn không tồn tại.' }
    }

    const durationMin = services.reduce((sum, service) => sum + service.durationMin, 0)
    const priceVnd = services.reduce((sum, service) => sum + service.priceVnd, 0)
    const openMinutes = (site.closeHour - site.openHour) * 60
    if (durationMin > openMinutes) {
      return {
        ok: false,
        code: 'validation',
        message: 'Tổng thời lượng vượt quá giờ mở cửa. Vui lòng bỏ bớt liệu trình rồi đặt lại.',
      }
    }

    const startsAt = new Date(payload.startsAt)
    if (Number.isNaN(startsAt.getTime())) {
      return { ok: false, code: 'validation', message: 'Thời gian đặt lịch không hợp lệ.' }
    }

    const dateIso = `${startsAt.getFullYear()}-${String(startsAt.getMonth() + 1).padStart(2, '0')}-${String(startsAt.getDate()).padStart(2, '0')}`
    if (!isOpenDay(startsAt)) {
      return {
        ok: false,
        code: 'closed',
        message: 'Studio đóng cửa ngày này. Vui lòng chọn từ Thứ Ba đến Thứ Bảy.',
      }
    }

    const daySlots = generateSlotsForDate(dateIso, durationMin)
    const match = daySlots.find((s) => Math.abs(new Date(s).getTime() - startsAt.getTime()) < 1000)
    if (!match) {
      return {
        ok: false,
        code: 'closed',
        message: 'Khung giờ nằm ngoài giờ mở cửa. Vui lòng chọn giờ khác.',
      }
    }

    // Grace: allow submit a couple minutes after the slot became "past" in the picker.
    if (startsAt.getTime() < Date.now() - 2 * 60_000) {
      return {
        ok: false,
        code: 'slot_full',
        message: 'Khung giờ này đã qua. Vui lòng chọn giờ khác.',
      }
    }

    const appointments = await readAppointments()
    const active = appointments.filter((a) => a.status !== 'huy')
    if (blocks(startsAt, durationMin, active)) {
      return {
        ok: false,
        code: 'slot_full',
        message: 'Khung giờ này đã kín. Vui lòng chọn giờ khác.',
      }
    }

    const booked: BookedService[] = services.map((service) => ({
      slug: service.slug,
      name: service.name,
      durationMin: service.durationMin,
      priceVnd: service.priceVnd,
    }))

    const appointment: Appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      serviceSlug: booked[0].slug,
      serviceName: booked.map((service) => service.name).join(' · '),
      services: booked,
      durationMin,
      priceVnd,
      startsAt: match,
      customerName: name,
      customerPhone: phone,
      note,
      status: 'moi',
      ownerNote: '',
      createdAt: new Date().toISOString(),
    }

    const items = await readAppointments()
    items.push(appointment)
    await writeAppointments(items)
    return { ok: true, appointment }
  } catch {
    return {
      ok: false,
      code: 'server',
      message: 'Không lưu được yêu cầu. Vui lòng thử lại sau hoặc gọi trực tiếp studio.',
    }
  }
}
