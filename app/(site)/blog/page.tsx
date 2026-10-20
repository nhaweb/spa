import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/page-intro'
import { formatPostDate, posts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Gợi ý chăm sóc da và chuẩn bị liệu trình từ studio mori.',
}

export default function BlogIndexPage() {
  return (
    <>
      <PageIntro
        title={
          <>
            Ghi chú
            <br />
            <em className="font-light">từ studio.</em>
          </>
        }
        description="Gợi ý chăm sóc da, chuẩn bị trước buổi hẹn và cách chọn liệu trình phù hợp."
      />

      <div className="mx-auto max-w-[1440px] px-6 pb-24 md:px-12">
        <div className="border-t border-foreground">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block border-b border-border py-8 transition-colors hover:bg-secondary md:px-4"
            >
              <time className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {formatPostDate(post.date)}
              </time>
              <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] md:text-4xl">{post.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
