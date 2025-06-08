"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Check,
  Pencil,
  Plus,
  Trash2,
  X,
  LogOut,
  Eye,
  BarChart3,
} from "lucide-react";
import { BlogPost } from "@/app/types/blog";
import { signOut } from "@/app/actions/auth";
import { approvePost, deletePost, getBlogPosts } from "@/app/actions/blogpost";

interface DashboardClientProps {
  user: any;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("my-posts");

  // React Hook Form for any forms (like filters, etc.)
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      filter: "all",
      sortBy: "newest",
    },
  });

  // TanStack Query for fetching posts
  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getBlogPosts({}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: pendingPosts = [],
    isLoading: pendingLoading,
    error: pendingError,
  } = useQuery({
    queryKey: ["pending-posts"],
    queryFn: () => getBlogPosts({ status: "pending" }),
    staleTime: 5 * 60 * 1000,
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: approvePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["pending-posts"] });
      toast({
        title: "Post approved",
        description: "The post has been published successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve post",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["pending-posts"] });
      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    },
  });

  const handleApprovePost = (postId: string) => {
    approveMutation.mutate(postId);
  };

  const handleDeletePost = (postId: string) => {
    deleteMutation.mutate(postId);
  };

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  const isLoading = postsLoading || pendingLoading;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Sign Out Button - positioned top right */}
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be signed out of your account and redirected to the
                homepage.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSignOut}
                disabled={signOutMutation.isPending}
              >
                {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">Published posts</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingPosts.length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                posts.filter((post) => {
                  const postDate = new Date(post.created_at);
                  const currentDate = new Date();
                  return (
                    postDate.getMonth() === currentDate.getMonth() &&
                    postDate.getFullYear() === currentDate.getFullYear()
                  );
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Posts this month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">System status</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-posts" className="relative">
            My Posts
            {posts.length > 0 && (
              <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                {posts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending Approval
            {pendingPosts.length > 0 && (
              <span className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs px-2 py-0.5 rounded-full">
                {pendingPosts.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-posts" className="space-y-4">
          {posts.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No posts yet</CardTitle>
                <CardDescription>
                  You haven't published any posts yet. Create your first post to
                  get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="lg">
                  <Link href="/blog/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Post
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="line-clamp-2 text-lg">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>
                            Published on{" "}
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/blog/${post.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/blog/edit/${post.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{post.title}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePost(post.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending
                                  ? "Deleting..."
                                  : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  {post.excerpt && (
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingPosts.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No pending posts</CardTitle>
                <CardDescription>
                  There are no posts waiting for approval.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="line-clamp-2 text-lg">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>
                            Submitted on{" "}
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                          <span className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleApprovePost(post.id)}
                          disabled={approveMutation.isPending}
                          variant="link"
                          className="text-emerald-600 border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          {approveMutation.isPending
                            ? "Approving..."
                            : "Approve"}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="link"
                              size="sm"
                              disabled={deleteMutation.isPending}
                              className="text-rose-600 border-rose-600 bg-rose-50 dark:bg-rose-950"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject "{post.title}"?
                                This will delete the post permanently.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePost(post.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending
                                  ? "Rejecting..."
                                  : "Reject"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  {post.excerpt && (
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
