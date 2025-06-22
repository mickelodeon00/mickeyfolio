import { approvePost, deletePost } from "@/app/actions/blogpost";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { handleMutation } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  pendingPosts: any
}

export default function PendingPost(props: Props) {

  const { pendingPosts } = props
  const [openDelete, setOpenDelete] = useState(false)


  const queryClient = useQueryClient()



  const approveMutation = useMutation({
    mutationFn: approvePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["pending-posts"] });
      setOpenDelete(false)
      toast("Post approved", {
        description: "The post has been published successfully",
      });
    },
    onError: () => {
      toast("Error", {
        description: "Failed to approve post",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["pending-posts"] });
      toast("Post deleted", {
        description: "The post has been deleted successfully",
      });
    },
    onError: () => {
      toast("Error", {
        description: "Failed to delete post",
        position: 'bottom-right'
      });
    },
  });




  return (
    <TabsContent value="pending" className="space-y-4">
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>
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
          {pendingPosts.map((post: any) => (
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
                      onClick={() => handleMutation(approveMutation, post.id)}
                      disabled={approveMutation.isPending}
                      variant="link"
                      className="text-emerald-600 border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {approveMutation.isPending
                        ? "Approving..."
                        : "Approve"}
                    </Button>
                    <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
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
                            onClick={() => handleMutation(deleteMutation, post.id)}
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
  )
}

