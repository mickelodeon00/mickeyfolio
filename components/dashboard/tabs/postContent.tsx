import { deletePost } from "@/app/actions/blogpost";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { handleMutation } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";


interface Props {
  posts: any
}


export default function PostContent(props: Props) {
  const [openDelete, setOpenDelete] = useState(false)

  const { posts } = props

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["pending-posts"] });
      toast("Post deleted", {
        description: "The post has been deleted successfully",
      });
      setOpenDelete(false)
    },
    onError: () => {
      toast("Error", {
        description: "Failed to delete post",
        position: 'bottom-right'
      });
    },
  });




  return (<TabsContent value="my-posts" className="space-y-4">
    <div className="flex gap-4">
      <Button asChild>
        <Link href="/blog/new">
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Link>
      </Button>
    </div>
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
        {posts.map((post: any) => (
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
                  <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
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
                        <Button
                          onClick={() => handleMutation(deleteMutation, post.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
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
  </TabsContent>)
}