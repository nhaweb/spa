import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqList } from '@/components/faq-list'
import { PageIntro } from '@/components/page-intro'
import { faqs } from '@/lib/faqs'

export const metadata: Metadata = {
  title: 'Câu hỏi thường gặp',
  description: 'Hủy đổi lịch, chuẩn bị buổi hẹn và thanh toán tại mori.',
}

export default function FaqPage() {
  return (
    <>
      <PageIntro
        title={
          <>
            Câu hỏi
            <br />
            <em className="font-light">thường gặp.</em>
          </>
        }
        description="Hủy/đổi lịch, chuẩn bị buổi hẹn và thanh toán — những điều khách thường hỏi trước khi đến."
      />

      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pb-24 md:grid-cols-[0.8fr_1.2fr] md:px-12">
        <div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Không thấy câu trả lời phù hợp?{' '}
            <Link href="/lien-he" className="text-foreground underline underline-offset-2">
              Liên hệ studio
            </Link>{' '}
            hoặc{' '}
            <Link href="/dat-lich" className="text-foreground underline underline-offset-2">
              gửi yêu cầu đặt lịch
            </Link>
            .
          </p>
        </div>
        <FaqList items={faqs} />
      </div>
    </>
  )
}
