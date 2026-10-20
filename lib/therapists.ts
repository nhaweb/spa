export type Therapist = {
  slug: string
  name: string
  role: string
  bio: string
  image: string
}

export const therapists: Therapist[] = [
  {
    slug: 'mai-tran',
    name: 'Mai Trần',
    role: 'Chuyên viên da · Đồng sáng lập',
    bio: 'Mai chuyên chăm sóc da dịu nhẹ và điều chỉnh liệu trình theo từng khách — luôn bắt đầu bằng lắng nghe trước khi chọn sản phẩm.',
    image: '/spa-therapist.png',
  },
  {
    slug: 'lan-nguyen',
    name: 'Lan Nguyễn',
    role: 'Chuyên viên massage · Thư giãn',
    bio: 'Lan phụ trách massage và các liệu trình cơ thể, tập trung giúp vai cổ và lưng trên được thả lỏng sau ngày dài.',
    image: '/spa-treatment.png',
  },
  {
    slug: 'ha-pham',
    name: 'Hà Phạm',
    role: 'Chuyên viên da · Phục hồi',
    bio: 'Hà đồng hành các buổi ngắn và liệu trình dành cho da nhạy cảm, ưu tiên công thức dịu và ít bước.',
    image: '/spa-detail.png',
  },
]
