import { NextResponse } from 'next/server'
import { createAppointment, type BookingPayload } from '@/lib/appointments'

export async function POST(request: Request) {
  let body: BookingPayload
  try {
    body = (await request.json()) as BookingPayload
  } catch {
    return NextResponse.json(
      { ok: false, code: 'validation', message: 'Dữ liệu gửi lên không hợp lệ.' },
      { status: 400 },
    )
  }

  const result = await createAppointment(body)
  if (!result.ok) {
    const status =
      result.code === 'server' ? 500 : result.code === 'slot_full' || result.code === 'closed' ? 409 : 400
    return NextResponse.json(result, { status })
  }
  return NextResponse.json(result, { status: 201 })
}
