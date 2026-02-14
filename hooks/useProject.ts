import { useMutation } from "@tanstack/react-query"
import { useConvex } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import type { Id } from "@/convex/_generated/dataModel"

export function useProjectMutations() {
  const convex = useConvex()

  const deleteProject = useMutation({
    mutationFn: (id: Id<"projects">) =>
      convex.mutation(api.projects.remove, { id }),
    onSuccess: () => toast.success("Project deleted successfully"),
    onError: () => toast.error("Failed to delete project"),
  })

  const createProject = useMutation({
    mutationFn: (args: any) =>
      convex.mutation(api.projects.create, args),
    onSuccess: () => toast.success("Project created successfully"),
    onError: () => toast.error("Failed to create project"),
  })

  const updateProject = useMutation({
    mutationFn: (args: any) =>
      convex.mutation(api.projects.update, args),
    onSuccess: () => toast.success("Project updated successfully"),
    onError: () => toast.error("Failed to update project"),
  })

  return {
    deleteProject,
    createProject,
    updateProject,
  }
}