import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageIntro } from '@/components/page-intro'
import { Reveal } from '@/components/reveal'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description: 'Câu chuyện studio mori — không gian chậm rãi cho da và cơ thể.',
}

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title={
          <>
            Một studio nhỏ
            <br />
            <em className="font-light">cho khoảng lặng.</em>
          </>
        }
        description={`${site.name} là studio chăm sóc da và cơ thể tại Việt Nam — không gian yên, liệu trình rõ ràng, đặt lịch đơn giản.`}
      />

      <section className="mx-auto grid max-w-[1440px] gap-12 px-6 pb-20 md:grid-cols-2 md:gap-20 md:px-12 md:pb-28">
        <Reveal variant="wipe" className="group relative aspect-[4/5] overflow-hidden">
          <Image
            src="/spa-hero.png"
            alt="Không gian studio"
            fill
            className="img-zoom object-cover"
            priority
          />
        </Reveal>
        <Reveal variant="blur" delay={180} className="flex flex-col justify-center">
          <p className="max-w-md font-serif text-3xl leading-[1.15] tracking-[-0.03em] md:text-4xl">
            Chúng tôi tin làm đẹp không cần ồn ào — chỉ cần đủ thời gian, đủ tay nghề, và một không
            gian để bạn thở chậm lại.
          </p>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            Mỗi liệu trình bắt đầu bằng vài phút lắng nghe: da hôm nay thế nào, cơ thể đang mệt chỗ
            nào, bạn muốn cảm thấy ra sao khi về.
          </p>
          <Link
            href="/dat-lich"
            className="mt-10 inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            Đặt lịch <ArrowUpRight size={14} />
          </Link>
        </Reveal>
      </section>

      <section className="border-t border-border bg-secondary px-6 py-20 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-3">
          {(
            [
              [
                'Da',
                'Liệu trình dịu nhẹ, các bước rõ ràng, phù hợp khí hậu và nhịp sống ở Việt Nam.',
                'left',
              ],
              [
                'Cơ thể',
                'Massage và chăm sóc cơ thể để thả lỏng — đây là spa, không phải phòng khám.',
                'up',
              ],
              [
                'Nhịp chậm',
                'Ít xao nhãng, đủ thời gian giữa các bước, và một tách trà sau buổi hẹn.',
                'right',
              ],
            ] as const
          ).map(([title, body, variant], i) => (
            <Reveal key={title} variant={variant} delay={i * 120}>
              <h2 className="font-serif text-3xl tracking-[-0.03em]">{title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
