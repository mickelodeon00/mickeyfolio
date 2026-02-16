import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PageWrapper from "@/components/layout/page-wrapper";
import FadeInWhenVisible from "@/components/general/fadeIn-when-visible";
import { fadeInLeft, fadeInUp } from "@/utils/animations";
import { removeSpecialChars } from "@/lib/utils";
import BlogPostCard from "@/components/blog/blog-post-card2";
import BlogCategoryClient from "@/components/blog/category";
// import { getBlogPosts } from "@/app/actions";
// import BlogPostCard from "@/components/blog/blog-post-card";

export const metadata = {
  title: "Blog | Micheal",
  description: "Read my latest thoughts and articles",
};

export default async function BlogPage() {
  // Fetch blog posts from the database



  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <FadeInWhenVisible variants={fadeInLeft}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold">Blog</h1>
              <Button asChild>
                <Link href="/blog/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
                </Link>
              </Button>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible variants={fadeInUp}>
            <BlogCategoryClient />
          </FadeInWhenVisible>
        </div>
      </div>
    </PageWrapper>
  );
}
