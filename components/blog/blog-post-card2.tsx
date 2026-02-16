"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { ExternalLink, CalendarDays, Clock } from "lucide-react"
import FadeInWhenVisible from "@/components/general/fadeIn-when-visible"
import { fadeInUp } from "@/utils/animations"
import { removeSpecialChars } from "@/lib/utils"
import type { Doc } from "@/convex/_generated/dataModel"

interface BlogPostCardProps {
  post: Doc<"posts">
  index?: number
}

export default function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateReadingTime = (content: string): string => {
    const wordsPerMinute = 200
    const wordCount = content.split(" ").length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
  }

  const createExcerpt = (content: string, maxLength = 150): string => {
    const textContent = content.replace(/<[^>]*>/g, "")
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent
  }

  return (
    <FadeInWhenVisible variants={fadeInUp}>
      <Card className="overflow-hidden rounded-xl border border-border bg-muted/5 backdrop-blur-sm transition hover:shadow-lg">
        {/* Image */}
        {post.featuredImage && (
          <div className="relative h-48 w-full">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
        )}

        {/* Title */}
        <CardHeader>
          <h3 className="text-2xl font-bold">{post.title}</h3>
          <div className="flex items-center gap-4 text-muted-foreground text-sm mt-1">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatDate(post._creationTime)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {calculateReadingTime(post.content)}
            </span>
          </div>
        </CardHeader>

        {/* Excerpt + Categories */}
        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm">
            {post.excerpt ?? createExcerpt(post.content)}
          </p>

          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Badge key={category} variant="secondary" className="capitalize">
                {removeSpecialChars(category)}
              </Badge>
            ))}
          </div>
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="flex flex-wrap gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href={`/blog/${post.slug}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Read More
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </FadeInWhenVisible>
  )
}