export type Service = {
  slug: string
  name: string
  summary: string
  detail: string
  durationMin: number
  priceVnd: number
  category: 'da' | 'co-the' | 'thu-gian'
}

export const services: Service[] = [
  {
    slug: 'cham-soc-da-signature',
    name: 'Chăm sóc da đặc trưng',
    summary: 'Làm sạch sâu · Massage điêu khắc · Mặt nạ',
    detail:
      'Liệu trình da chính của mori: làm sạch kỹ, massage điêu khắc nhẹ và mặt nạ theo tình trạng da trong ngày. Phù hợp lần đầu đến, hoặc khi da cần được chăm sóc lại từ đầu một cách dịu dàng.',
    durationMin: 75,
    priceVnd: 890_000,
    category: 'da',
  },
  {
    slug: 'glow-nhanh',
    name: 'Da tươi nhanh',
    summary: 'Tẩy tế bào chết enzyme · Dưỡng ẩm · Chống nắng',
    detail:
      'Buổi ngắn gọn khi bạn muốn da sáng hơn trước sự kiện hoặc ngày bận. Tập trung làm sạch nhẹ, cấp ẩm và kết thúc bằng lớp chống nắng.',
    durationMin: 45,
    priceVnd: 590_000,
    category: 'da',
  },
  {
    slug: 'nghi-le-yen-tinh',
    name: 'Thư giãn toàn thân',
    summary: 'Massage toàn thân · Tinh dầu · Trà',
    detail:
      'Một buổi chậm rãi: massage toàn thân với tinh dầu, kết thúc bằng trà ấm. Dành cho những ngày cần thả lỏng cả cơ thể lẫn nhịp thở.',
    durationMin: 90,
    priceVnd: 1_150_000,
    category: 'thu-gian',
  },
  {
    slug: 'reset-bach-huyet',
    name: 'Massage dẫn lưu',
    summary: 'Chải khô · Massage bạch huyết · Dưỡng ẩm',
    detail:
      'Chuỗi thao tác nhẹ giúp cơ thể cảm thấy nhẹ nhàng hơn, giảm cảm giác nặng nề. Không thay thế điều trị y khoa — tập trung vào thư giãn và chăm sóc cơ thể.',
    durationMin: 60,
    priceVnd: 790_000,
    category: 'co-the',
  },
  {
    slug: 'tay-te-bao-co-the',
    name: 'Tẩy tế bào chết cơ thể',
    summary: 'Tẩy da thảo mộc · Dưỡng dầu · Hơi ấm',
    detail:
      'Làm mềm da, loại bỏ tế bào chết và dưỡng ẩm sâu. Thường kết hợp trước buổi massage để da hấp thụ dầu tốt hơn.',
    durationMin: 50,
    priceVnd: 650_000,
    category: 'co-the',
  },
  {
    slug: 'massage-vai-co',
    name: 'Massage vai cổ',
    summary: 'Giảm căng cứng · Tập trung lưng trên · Thư giãn',
    detail:
      'Tập trung vùng vai, cổ và lưng trên — phù hợp người ngồi máy tính nhiều. Có thể nâng thành liệu trình dài hơn nếu bạn muốn.',
    durationMin: 40,
    priceVnd: 450_000,
    category: 'thu-gian',
  },
  {
    slug: 'cham-soc-da-nhay-cam',
    name: 'Chăm sóc da nhạy cảm',
    summary: 'Làm dịu · Phục hồi hàng rào da · Ít kích ứng',
    detail:
      'Công thức dịu, ít bước, ưu tiên phục hồi cảm giác da. Đầu buổi có tư vấn ngắn để chọn sản phẩm phù hợp với phản ứng da của bạn.',
    durationMin: 60,
    priceVnd: 820_000,
    category: 'da',
  },
  {
    slug: 'goi-doi',
    name: 'Gói đôi yên bình',
    summary: 'Hai liệu trình cùng lúc · Không gian riêng',
    detail:
      'Hai khách trải nghiệm trong cùng một khung giờ, tại không gian yên tĩnh. Liên hệ trước để xác nhận phòng và chọn liệu trình phù hợp từng người.',
    durationMin: 90,
    priceVnd: 2_100_000,
    category: 'thu-gian',
  },
]

export function getService(slug: string) {
  return services.find((s) => s.slug === slug)
}

export function formatVnd(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDuration(min: number) {
  return `${min} phút`
}
