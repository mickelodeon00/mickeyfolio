// hooks/usePosts.ts

import { useMutation } from "@tanstack/react-query"
import { useConvex } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import type { Id } from "@/convex/_generated/dataModel"
import { uploadImage, deleteImage } from "@/app/actions/r2"

interface CreatePostInput {
  title: string
  content: string
  excerpt?: string
  categories: string[]
  slug: string
  author: string
  authorEmail: string
  featuredImage?: File | null
}

interface UpdatePostInput {
  id: Id<"posts">
  title?: string
  content?: string
  excerpt?: string
  categories?: string[]
  featuredImage?: File | null
}

export function usePostMutations() {
  const convex = useConvex()

  const createPost = useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const postId = crypto.randomUUID()
      let featuredImageUrl: string | undefined

      if (input.featuredImage) {
        const formData = new FormData()
        formData.append('file', input.featuredImage)
        formData.append('id', postId)
        formData.append('directory', 'posts')

        featuredImageUrl = await uploadImage(formData)
      }

      try {
        const { featuredImage, ...postData } = input
        return await convex.mutation(api.posts.create, {
          ...postData,
          featuredImage: featuredImageUrl,
        })
      } catch (error) {
        if (featuredImageUrl) {
          await deleteImage({ id: postId, directory: 'posts' })
        }
        throw error
      }
    },
    onSuccess: () => toast.success("Post submitted for approval"),
    onError: (error) => toast.error(error.message || "Failed to create post"),
  })

  const updatePost = useMutation({
    mutationFn: async (input: UpdatePostInput) => {
      let newImageUrl: string | undefined

      if (input.featuredImage) {
        const formData = new FormData()
        formData.append('file', input.featuredImage)
        formData.append('id', input.id)
        formData.append('directory', 'posts')

        newImageUrl = await uploadImage(formData)
      }

      const { featuredImage, ...updateData } = input

      const result = await convex.mutation(api.posts.update, {
        ...updateData,
        ...(newImageUrl && { featuredImage: newImageUrl }),
      })

      if (newImageUrl && result.oldFeaturedImage && newImageUrl !== result.oldFeaturedImage) {
        await deleteImage({ url: result.oldFeaturedImage })
      }

      return result
    },
    onSuccess: () => toast.success("Post updated"),
    onError: (error) => toast.error(error.message || "Failed to update post"),
  })

  const deletePost = useMutation({
    mutationFn: async (id: Id<"posts">) => {
      const result = await convex.mutation(api.posts.remove, { id })

      const postId = result.postId.toString()
      await deleteImage({ id: postId, directory: 'posts' })

      return result
    },
    onSuccess: () => toast.success("Post deleted successfully"),
    onError: () => toast.error("Failed to delete post"),
  })

  const approvePost = useMutation({
    mutationFn: (id: Id<"posts">) =>
      convex.mutation(api.posts.approve, { id }),
    onSuccess: () => toast.success("Post approved"),
    onError: () => toast.error("Failed to approve post"),
  })

  return {
    createPost,
    updatePost,
    deletePost,
    approvePost,
  }
}