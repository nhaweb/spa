/** Studio details — chỉnh tại đây khi triển khai. */
export const site = {
  name: 'mori',
  tagline: 'Chăm sóc da và cơ thể theo nhịp chậm',
  description:
    'Studio chăm sóc da và cơ thể — không gian yên tĩnh, liệu trình rõ ràng, đặt lịch dễ dàng.',
  email: 'hello@mori.studio',
  phone: '0901 234 567',
  phoneHref: 'tel:+84901234567',
  zalo: 'https://zalo.me/0901234567',
  addressLines: ['12 Nguyễn Thị Minh Khai', 'Quận 1, TP. Hồ Chí Minh'],
  /** Giờ mở cửa: Thứ Ba — Thứ Bảy */
  hoursLabel: 'Thứ Ba — Thứ Bảy',
  hoursTime: '9:00 — 19:00',
  openDays: [2, 3, 4, 5, 6] as number[], // Sun=0
  openHour: 9,
  closeHour: 19,
  slotMinutes: 30,
  mapEmbedUrl:
    'https://www.openstreetmap.org/export/embed.html?bbox=106.690%2C10.770%2C106.710%2C10.785&layer=mapnik&marker=10.776%2C106.700',
  mapLink: 'https://www.openstreetmap.org/?mlat=10.776&mlon=106.700#map=16/10.776/106.700',
  instagram: 'https://instagram.com/',
  year: 2026,
} as const

export const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/dich-vu', label: 'Dịch vụ' },
  { href: '/ve-chung-toi', label: 'Về chúng tôi' },
  { href: '/doi-ngu', label: 'Đội ngũ' },
  { href: '/blog', label: 'Blog' },
  { href: '/lien-he', label: 'Liên hệ' },
] as const
