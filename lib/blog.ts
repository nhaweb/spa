export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  body: string[]
}

export const posts: BlogPost[] = [
  {
    slug: 'cham-soc-da-mua-nang',
    title: 'Chăm sóc da mùa nắng: ít bước, đều đặn',
    excerpt:
      'Ba thói quen đơn giản giúp da dễ chịu hơn khi trời oi bức — gợi ý chăm sóc tại nhà, không thay thế tư vấn chuyên môn.',
    date: '2026-03-12',
    body: [
      'Mùa nắng ở Việt Nam thường kèm độ ẩm cao. Thay vì chồng quá nhiều lớp sản phẩm, hãy ưu tiên làm sạch nhẹ buổi tối, dưỡng ẩm đủ và chống nắng mỗi sáng khi ra ngoài.',
      'Nếu da đang kích ứng, giảm tần suất dùng acid / retinol và chọn liệu trình dịu tại spa để da có thời gian phục hồi.',
      'Khi đặt lịch tại mori, ghi chú tình trạng da sẽ giúp buổi hẹn được điều chỉnh phù hợp hơn.',
    ],
  },
  {
    slug: 'truoc-sau-massage',
    title: 'Trước và sau buổi massage',
    excerpt: 'Vài gợi ý giúp cơ thể tiếp nhận liệu trình thư giãn tốt hơn.',
    date: '2026-02-28',
    body: [
      'Trước buổi hẹn: ăn nhẹ, hạn chế caffeine mạnh nếu bạn dễ hồi hộp, và mặc đồ dễ thay.',
      'Sau buổi hẹn: uống đủ nước, giữ ấm nếu phòng máy lạnh, và tránh tập nặng ngay nếu cơ đang mềm. Đây là gợi ý chung — không phải chỉ định y khoa.',
      'Nếu cần đổi lịch, vui lòng xem trang Câu hỏi thường gặp để biết thời hạn báo trước.',
    ],
  },
  {
    slug: 'chon-lieu-trinh-lan-dau',
    title: 'Lần đầu chọn liệu trình thế nào?',
    excerpt: 'Bắt đầu từ nhu cầu: da, cơ thể, hay chỉ cần một khoảng yên tĩnh.',
    date: '2026-01-20',
    body: [
      'Lần đầu, nhiều khách chọn Da tươi nhanh hoặc Chăm sóc da đặc trưng để làm quen với nhịp studio. Nếu bạn đang căng vai cổ, Massage vai cổ là lựa chọn nhẹ nhàng để bắt đầu.',
      'Thư giãn toàn thân phù hợp khi bạn muốn cả cơ thể được thả lỏng trong một buổi dài hơn.',
      'Bạn có thể bắt đầu từ trang Dịch vụ, chọn liệu trình, rồi Đặt lịch kèm ghi chú ngắn về mong muốn của mình.',
    ],
  },
]

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}
