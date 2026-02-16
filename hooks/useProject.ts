import { useMutation } from "@tanstack/react-query"
import { useConvex } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import type { Id } from "@/convex/_generated/dataModel"
import { deleteImage, uploadImage } from "@/app/actions/r2"


// Base fields shared between create and update
interface ProjectBase {
  title: string
  description: string
  stack: string[]
  website?: string | null
  githubRepository?: string | null
  imageFile?: File | null
}

// Create: all base fields required (except optional ones)
export interface CreateProjectInput extends ProjectBase {
  // No id - generated in hook
}

// Update: id required, everything else optional
export interface UpdateProjectInput extends Partial<ProjectBase> {
  id: string  // Required to know which project to update
}

export function useProjectMutations() {
  const convex = useConvex()

  const createProject = useMutation({
    mutationFn: async (input: CreateProjectInput) => {  // ✅ No Omit needed!
      // Generate ID here
      const projectId = crypto.randomUUID()
      let imageUrl: string | null = null

      // Upload image if provided
      if (input.imageFile) {
        const formData = new FormData()
        formData.append('file', input.imageFile)
        formData.append('id', projectId)
        formData.append('directory', 'projects')

        imageUrl = await uploadImage(formData)
      }

      // Create project in Convex
      try {
        const { imageFile, ...projectData } = input
        return await convex.mutation(api.projects.create, {
          ...projectData,
          imageUrl,
        })
      } catch (error) {
        // Cleanup: Delete uploaded image if Convex fails
        if (imageUrl) {
          await deleteImage({ id: projectId, directory: "projects" })
        }
        throw error
      }
    },
    onSuccess: () => toast.success("Project created successfully"),
    onError: (error) => toast.error(error.message || "Failed to create project"),
  })

  const updateProject = useMutation({
    mutationFn: async (input: UpdateProjectInput) => {
      let newImageUrl: string | null = null

      // Upload new image if provided
      if (input.imageFile) {
        const formData = new FormData()
        formData.append('file', input.imageFile)
        formData.append('id', input.id)  // Use id from input, call it projectId internally
        formData.append('directory', "projects")


        newImageUrl = await uploadImage(formData)
      }

      // Update project in Convex
      const { imageFile, id, ...updateData } = input

      const result = await convex.mutation(api.projects.update, {
        id: id as Id<"projects">,
        ...updateData,  // ✅ Only sends fields that were provided
        ...(newImageUrl && { imageUrl: newImageUrl }),
      })

      // Delete old image if new one was uploaded
      if (newImageUrl && result.oldImageUrl && newImageUrl !== result.oldImageUrl) {
        await deleteImage({ url: result.oldImageUrl, directory: "projects" })
      }

      return result
    },
    onSuccess: () => toast.success("Project updated successfully"),
    onError: (error) => {
      toast.error(error.message || "Failed to update project")
    },
  })

  const deleteProject = useMutation({
    mutationFn: async (id: Id<"projects">) => {
      const result = await convex.mutation(api.projects.remove, { id })

      // Delete images from R2
      const projectId = id.toString()
      await deleteImage({ id: projectId, directory: "projects" })

      return result
    },
    onSuccess: () => toast.success("Project deleted successfully"),
    onError: (error) => toast.error(error.message || "Failed to delete project"),
  })

  return {
    createProject,
    updateProject,
    deleteProject,
  }
}