"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import FadeInWhenVisible from "@/components/general/fadeIn-when-visible";
import { fadeInUp } from "@/utils/animations";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  created_at: string;
  author?: string;
  status?: "published" | "draft";
  tags?: string[];
  category?: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  index?: number;
}

export default function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate reading time (rough estimate: 200 words per minute)
  const calculateReadingTime = (content?: string): string => {
    if (!content) return "1 min";
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  // Create excerpt from content
  const createExcerpt = (content?: string, maxLength: number = 150): string => {
    if (!content) return "";
    const textContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;
  };

  return (
    <FadeInWhenVisible
      variants={fadeInUp}
      // delay={index * 0.1}
      // className="w-full"
    >
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{calculateReadingTime(post.content)}</span>
              </div>
              {post.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              )}
            </div>
            {post.status && (
              <Badge
                variant={post.status === "published" ? "default" : "secondary"}
                className="capitalize"
              >
                {post.status}
              </Badge>
            )}
          </div>

          <Link href={`/blog/${post.slug}`} className="group">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>

          {post.excerpt && (
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              {post.excerpt}
            </p>
          )}

          {!post.excerpt && post.content && (
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              {createExcerpt(post.content)}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {post.tags &&
                post.tags.map((tag: string, tagIndex: number) => (
                  <Badge key={tagIndex} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              {post.category && (
                <Badge variant="outline" className="text-xs">
                  {post.category}
                </Badge>
              )}
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
            >
              Read more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </FadeInWhenVisible>
  );
}
