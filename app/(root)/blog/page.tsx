import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PageWrapper from "@/components/layout/page-wrapper";
import FadeInWhenVisible from "@/components/general/fadeIn-when-visible";
import { fadeInLeft, fadeInUp } from "@/utils/animations";
import { removeSpecialChars } from "@/lib/utils";
import {
  getAllCategories,
  getBlogPosts,
  getBolgPostsByStatus,
} from "@/app/actions/blogpost";
import BlogPostCard from "@/components/blog/blog-post-card2";
// import { getBlogPosts } from "@/app/actions";
// import BlogPostCard from "@/components/blog/blog-post-card";

export const metadata = {
  title: "Blog | Micheal",
  description: "Read my latest thoughts and articles",
};

export default async function BlogPage() {
  // Fetch blog posts from the database
  const { data: posts, error: postError } = await getBolgPostsByStatus({
    status: "approved",
  });

  // const categories = [
  //   { id: "1", name: "Web Development", slug: "web-development" },
  //   { id: "2", name: "Design", slug: "design" },
  //   { id: "3", name: "Technology", slug: "technology" },
  // ];

  const categories = await getAllCategories();

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
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

            <div className="mb-8">
              <h2 className="text-lg font-medium mb-3">Categories</h2>
              <div className="flex flex-wrap gap-2">
                <Link href="/blog">
                  <Badge variant="outline" className="hover:bg-secondary">
                    All
                  </Badge>
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category?.slug}
                    href={`/blog/categories/${category.slug}`}
                  >
                    <Badge
                      variant="outline"
                      className="hover:bg-secondary capitalize"
                    >
                      {removeSpecialChars(category.slug)}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible variants={fadeInUp}>
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <BlogPostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-medium mb-2">No posts yet</h2>
                <p className="text-muted-foreground mb-6">
                  Start writing your first blog post
                </p>
                <Button asChild>
                  <Link href="/blog/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Post
                  </Link>
                </Button>
              </div>
            )}
          </FadeInWhenVisible>
        </div>
      </div>
    </PageWrapper>
  );
}
