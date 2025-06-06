"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Github, ExternalLink, CalendarDays, Clock } from "lucide-react";
import FadeInWhenVisible from "@/components/general/fadeIn-when-visible";
import { fadeInUp } from "@/utils/animations";
import { CustomBadge } from "./custom-badge";
import { removeSpecialChars } from "@/lib/utils";

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
  categories?: string[];
  codeUrl?: string;
  demoUrl?: string;
  featured_image?: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  index?: number;
}

export default function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadingTime = (content?: string): string => {
    if (!content) return "1 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const createExcerpt = (content?: string, maxLength = 150): string => {
    if (!content) return "";
    const textContent = content.replace(/<[^>]*>/g, "");
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;
  };

  const Tags = ["tecnnology", "web development"];

  return (
    <FadeInWhenVisible variants={fadeInUp}>
      <Card
        key={post.id}
        className="overflow-hidden rounded-xl border border-border bg-muted/5 backdrop-blur-sm transition hover:shadow-lg"
      >
        {/* Image */}
        <div className="relative h-48 w-full">
          <Image
            src={
              post?.featured_image || "/placeholder.svg?height=300&width=600"
            }
            alt={post.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>

        {/* Title */}
        <CardHeader>
          <h3 className="text-2xl font-bold">{post.title}</h3>
          <div className="flex items-center gap-4 text-muted-foreground text-sm mt-1">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatDate(post.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {calculateReadingTime(post.content)}
            </span>
          </div>
        </CardHeader>

        {/* Excerpt + Tags */}
        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm">
            {post.excerpt ?? createExcerpt(post.content)}
          </p>

          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {post?.categories?.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center text-center justify-center capitalize "
              >
                {removeSpecialChars(tag)}
              </Badge>
              // <CustomBadge label={tag} />
            ))}
            {/* {post.categories && <Badge variant="outline">yyyyyyyyyyy</Badge>} */}
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

          {post.codeUrl && (
            <Button asChild variant="outline" size="sm">
              <Link
                href={post.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 mr-2" />
                Code
              </Link>
            </Button>
          )}

          {post.demoUrl && (
            <Button asChild size="sm">
              <Link
                href={post.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Demo
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </FadeInWhenVisible>
  );
}
