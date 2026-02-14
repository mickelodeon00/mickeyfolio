import { useMutation } from "@tanstack/react-query"
import { useConvex } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import type { Id } from "@/convex/_generated/dataModel"

export function usePostMutations() {
  const convex = useConvex()

  const deletePost = useMutation({
    mutationFn: (id: Id<"posts">) =>
      convex.mutation(api.posts.remove, { id }),
    onSuccess: () => toast.success("Post deleted successfully"),
    onError: () => toast.error("Failed to delete post"),
  })

  const approvePost = useMutation({
    mutationFn: (id: Id<"posts">) =>
      convex.mutation(api.posts.approve, { id }),
    onSuccess: () => toast.success("Post approved"),
    onError: () => toast.error("Failed to approve post"),
  })

  const updatePost = useMutation({
    mutationFn: (args: { id: Id<"posts">; title?: string; content?: string }) =>
      convex.mutation(api.posts.update, args),
    onSuccess: () => toast.success("Post updated"),
    onError: () => toast.error("Failed to update post"),
  })

  return {
    deletePost,
    approvePost,
    updatePost,
  }
}