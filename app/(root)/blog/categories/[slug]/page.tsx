// import { getAllCategories, getPostsByCategory } from "@/lib/supabase/database";
// import PostCard from "@/components/blog/post-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategories, getPostsByCategory } from "@/app/actions/blogpost";
import BlogPostCard from "@/components/blog/blog-post-card2";
import { removeSpecialChars } from "@/lib/utils";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

type Props = {
  searchParams?: Promise<{
    token?: string;
  }>;
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} | Blog | Micheal`,
    description: `Posts in the ${category.name} category`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = await getAllCategories();

  const { slug: category } = categories.find((cat) => cat?.slug === slug);

  if (!category) {
    notFound();
  }

  // Fetch posts that include this category in their categories array
  const posts = await getPostsByCategory([category]);

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Category:{" "}
              <span className="capitalize">
                {removeSpecialChars(category as string)}
              </span>
            </h1>
            {posts && (
              <p className="text-muted-foreground">
                {posts.length} {posts.length === 1 ? "post" : "posts"} found
              </p>
            )}
          </div>

          <div className="w-full md:w-auto">
            <h2 className="text-lg font-medium mb-3">Browse Categories</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/blog">
                <Badge variant="outline" className="hover:bg-secondary">
                  All
                </Badge>
              </Link>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/blog/categories/${cat.slug}`}>
                  <Badge
                    variant={cat.slug === category ? "default" : "outline"}
                    className={
                      cat.slug !== category ? "hover:bg-secondary" : ""
                    }
                  >
                    {removeSpecialChars(cat?.slug)}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-2">
              No posts in this category yet
            </h2>
            <p className="text-muted-foreground">
              Check back later or explore other categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
