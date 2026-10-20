import type { Metadata } from 'next'
import { BookingForm } from '@/components/booking-form'
import { PageIntro } from '@/components/page-intro'

export const metadata: Metadata = {
  title: 'Đặt lịch',
  description: 'Chọn liệu trình, khung giờ và gửi yêu cầu đặt lịch tại mori.',
}

type Props = {
  searchParams: Promise<{ service?: string }>
}

export default async function BookingPage({ searchParams }: Props) {
  const { service } = await searchParams

  return (
    <>
      <PageIntro
        title={
          <>
            Đặt lịch
            <br />
            <em className="font-light">theo nhịp của bạn.</em>
          </>
        }
        description="Chọn một hoặc nhiều liệu trình, ngày giờ còn trống, rồi để lại thông tin liên hệ. Các liệu trình sẽ được xếp liền nhau trong cùng một buổi. Yêu cầu ở trạng thái chờ xác nhận — studio sẽ gọi lại qua số điện thoại của bạn."
      />
      <div className="mx-auto max-w-[800px] px-6 pb-24 md:px-12">
        <BookingForm initialService={service} />
      </div>
    </>
  )
}
