"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { createClient } from "@/supabase/client";
import { BlogPost } from "@/app/types/blog";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pendingPosts, setPendingPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      setUser(session.user);
      fetchPosts(session.user.id);
    };

    checkUser();
  }, [router]);

  const fetchPosts = async (userId: string) => {
    try {
      setIsLoading(true);

      // Fetch user's published posts
      const { data: userPosts, error: postsError } = await supabase
        .from("posts")
        .select(
          `
          *,
          post_categories(
            categories(id, name)
          )
        `
        )
        .eq("author_id", userId)
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Fetch pending posts (for admin)
      const { data: adminPending, error: pendingError } = await supabase
        .from("posts")
        .select(
          `
          *,
          post_categories(
            categories(id, name)
          )
        `
        )
        .eq("published", false)
        .order("created_at", { ascending: false });

      if (pendingError) throw pendingError;

      setPosts(userPosts || []);
      setPendingPosts(adminPending || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ published: true })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Post approved",
        description: "The post has been published successfully",
      });

      // Refresh posts
      if (user) fetchPosts(user.id);
    } catch (error) {
      console.error("Error approving post:", error);
      toast({
        title: "Error",
        description: "Failed to approve post",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      // First delete post_categories entries
      const { error: categoriesError } = await supabase
        .from("post_categories")
        .delete()
        .eq("post_id", postId);

      if (categoriesError) throw categoriesError;

      // Then delete the post
      const { error: postError } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (postError) throw postError;

      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully",
      });

      // Refresh posts
      if (user) fetchPosts(user.id);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 md:py-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="my-posts">
          <TabsList className="mb-8">
            <TabsTrigger value="my-posts">My Posts</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          </TabsList>

          <TabsContent value="my-posts">
            {posts.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No posts yet</CardTitle>
                  <CardDescription>
                    You haven't published any posts yet. Create your first post
                    to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/blog/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Post
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>
                        Published on{" "}
                        {new Date(post.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/blog/${post.slug}`}>View</Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/blog/edit/${post.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            {pendingPosts.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No pending posts</CardTitle>
                  <CardDescription>
                    There are no posts waiting for approval.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>
                        Submitted on{" "}
                        {new Date(post.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprovePost(post.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
