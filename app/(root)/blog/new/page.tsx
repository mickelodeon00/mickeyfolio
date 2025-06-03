import PostEditor from "@/components/blog/post-editor";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageWrapper from "@/components/layout/page-wrapper";
import { getAllCategories } from "@/app/actions/blogpost";

export const metadata = {
  title: "Create New Blog Post | Micheal",
  description: "Create a new blog post for your portfolio",
};

export default async function NewBlogPage() {
  // In a real app, this would fetch from Supabase
  // const categories = [
  //   { id: "1", name: "Web Development", slug: "web-development" },
  //   { id: "2", name: "Design", slug: "design" },
  //   { id: "3", name: "Technology", slug: "technology" },
  // ];

  const categories = await getAllCategories();

  const userId = "demo-user-id";

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Create New Blog Post</h1>
            <Button asChild variant="outline">
              <Link href="/blog">Cancel</Link>
            </Button>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <PostEditor categories={categories} userId={userId} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
