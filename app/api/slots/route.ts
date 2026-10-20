import { NextResponse } from 'next/server'
import { availableSlots } from '@/lib/appointments'
import { getService } from '@/lib/services'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const servicesParam = searchParams.get('services')
  const service = searchParams.get('service')
  const slugs = (servicesParam ? servicesParam.split(',') : service ? [service] : [])
    .map((slug) => slug.trim())
    .filter(Boolean)

  if (!date || slugs.length === 0) {
    return NextResponse.json(
      { ok: false, message: 'Thiếu ngày hoặc liệu trình.' },
      { status: 400 },
    )
  }

  if (slugs.some((slug) => !getService(slug))) {
    return NextResponse.json({ ok: false, message: 'Liệu trình không tồn tại.' }, { status: 404 })
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, message: 'Ngày không hợp lệ.' }, { status: 400 })
  }

  const slots = await availableSlots(date, [...new Set(slugs)])
  return NextResponse.json({ ok: true, slots })
}
