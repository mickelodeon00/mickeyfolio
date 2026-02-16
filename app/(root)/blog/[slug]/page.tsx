import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User, ArrowLeft, BookOpen } from "lucide-react"
import type { Metadata } from "next"
import FadeInWhenVisible from "@/components/general/fadeIn-when-visible"
import { fadeInUp } from "@/utils/animations"
import { ShareButton } from "@/components/blog/slug/share-button"
import Article from "@/components/blog/slug/article"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

type Props = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchQuery(api.posts.getBySlug, { slug })

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Blog | Micheal`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: "article",
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await fetchQuery(api.posts.getBySlug, { slug })

  if (!post) {
    notFound()
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateReadingTime = (content: string): string => {
    const wordsPerMinute = 200
    const textContent = content.replace(/<[^>]*>/g, "")
    const wordCount = textContent.split(" ").length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4 pt-8 min-h-20"></div>

      <div className="container mx-auto px-4 pb-12">
        <article className="max-w-4xl mx-auto">
          <FadeInWhenVisible variants={fadeInUp}>
            <header className="mb-12">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {post.title}
              </h1>

              {/* Categories */}
              {post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors capitalize"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-lg border">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post._creationTime)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{calculateReadingTime(post.content)}</span>
                </div>

                {post.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Article</span>
                </div>

                <ShareButton
                  title={post.title}
                  url={`https://mickeyfolio.vercel.app/blog/${post.slug}`}
                />
              </div>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full mb-12 rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}
            </header>
          </FadeInWhenVisible>

          {/* Article Content */}
          <Article content={post.content} />

          {/* Navigation */}
          <FadeInWhenVisible variants={fadeInUp}>
            <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row gap-4 justify-between">
              <Button variant="outline" asChild>
                <Link href="/blog" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  All Posts
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href="/blog/new" className="flex items-center gap-2">
                  Create New Post
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </Button>
            </div>
          </FadeInWhenVisible>
        </article>
      </div>
    </div>
  )
}