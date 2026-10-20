import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatPostDate, getPost, posts } from '@/lib/blog'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Blog' }
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-[720px] px-6 py-12 md:px-12 md:py-20">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {formatPostDate(post.date)}
      </p>
      <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-[-0.04em] md:text-6xl">
        {post.title}
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
      <div className="mt-12 space-y-6 text-sm leading-relaxed text-foreground/90">
        {post.body.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </div>
      <div className="mt-16 flex flex-wrap gap-6 border-t border-border pt-8 text-[11px] uppercase tracking-[0.18em]">
        <Link href="/blog" className="underline underline-offset-4">
          Tất cả bài viết
        </Link>
        <Link href="/dat-lich" className="underline underline-offset-4">
          Đặt lịch
        </Link>
      </div>
    </article>
  )
}
