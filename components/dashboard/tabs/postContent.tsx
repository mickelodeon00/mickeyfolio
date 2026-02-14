'use client'

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { usePostMutations } from "@/hooks/usePosts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Eye, Pencil, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { Id } from "@/convex/_generated/dataModel"

export default function PostContent() {
  const [deleteId, setDeleteId] = useState<Id<"posts"> | null>(null)

  const posts = useQuery(api.posts.list, { status: "approved" }) ?? []
  const { deletePost } = usePostMutations()

  const handleDelete = () => {
    if (!deleteId) return
    deletePost.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    })
  }

  if (posts === undefined) return <div>Loading...</div>

  return (
    <TabsContent value="my-posts" className="space-y-4">
      <Button asChild>
        <Link href="/blog/new">
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Link>
      </Button>

      {posts.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No posts yet</CardTitle>
            <CardDescription>
              You haven't published any posts yet. Create your first post to get started.
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
            <Card key={post._id} className="hover:shadow-md transition-all duration-200">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>Published on {new Date(post._creationTime).toLocaleDateString()}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/blog/${post.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/blog/edit/${post._id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog open={deleteId === post._id} onOpenChange={(open) => !open && setDeleteId(null)}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(post._id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{post.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button
                            onClick={handleDelete}
                            disabled={deletePost.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletePost.isPending ? "Deleting..." : "Delete"}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              {post.excerpt && (
                <CardContent className="pt-0">
                  <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  )
}