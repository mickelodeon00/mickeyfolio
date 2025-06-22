"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  X,
  Eye,
  BarChart3,
} from "lucide-react";
import { getBlogPosts, getProjects } from "@/app/actions/blogpost";

import PostContent from "./tabs/postContent";
import PendingPost from "./tabs/pendingPost";
import ProjectContent from "./tabs/projectContent";



interface DashboardClientProps {
  user: any;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("my-posts");
  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000
  })

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


  const isLoading = postsLoading || pendingLoading || projectsError

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
        <TabsList className="grid w-full grid-cols-3">
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
          <TabsTrigger value="projects" className="relative">
            Projects
            {projects.length > 0 && (
              <span className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs px-2 py-0.5 rounded-full">
                {projects.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <PostContent posts={posts} />
        <PendingPost pendingPosts={pendingPosts} />
        <ProjectContent projects={projects} />

      </Tabs>
    </div>
  );
}
