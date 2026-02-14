'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useProjectMutations } from '@/hooks/useProject'
import EditProjectForm from './projectForm'
import type { Doc } from '@/convex/_generated/dataModel'

interface ProjectCardProps {
  project: Doc<"projects">
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [openSheet, setOpenSheet] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const { deleteProject } = useProjectMutations()

  const handleDelete = () => {
    deleteProject.mutate(project._id, {
      onSuccess: () => setOpenDelete(false),
    })
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 overflow-hidden">
      <CardHeader>
        <div className="flex justify-between gap-4 items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-2 text-lg">{project.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1 text-sm text-muted-foreground">
              {project.description}
            </CardDescription>
          </div>

          <div className="flex gap-2">
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Pencil className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[500px] max-h-[100vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Edit Project</SheetTitle>
                </SheetHeader>
                <EditProjectForm project={project} onClose={() => setOpenSheet(false)} />
              </SheetContent>
            </Sheet>

            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{project.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    onClick={handleDelete}
                    disabled={deleteProject.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteProject.isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs px-2 py-1">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}