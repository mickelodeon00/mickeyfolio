// components/dashboard/editProjectForm.tsx (updated)

'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { SimpleFileUpload } from '../general/fileUpload'
import { useProjectMutations } from '@/hooks/useProject'
import type { Doc } from '@/convex/_generated/dataModel'

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  stack: z.array(z.string()).min(1, 'At least one technology is required'),
  website: z.string().optional(),
  githubRepository: z.string().optional(),
  // Remove imageFile from schema - handle separately
})

type FormData = z.infer<typeof formSchema>

interface EditProjectFormProps {
  project: Doc<"projects">
  onClose: () => void
}

export default function EditProjectForm({ project, onClose }: EditProjectFormProps) {
  const [currentTech, setCurrentTech] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { updateProject } = useProjectMutations()

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      stack: project.stack,
      website: project.website ?? undefined,
      githubRepository: project.githubRepository ?? undefined,
    },
  })

  const watchedStack = watch('stack')

  const onSubmit = (data: FormData) => {
    updateProject.mutate(
      {
        id: project._id,
        ...data,
        imageFile: selectedFile,  // ✅ Pass selectedFile directly
      },
      { onSuccess: onClose }
    )
  }

  const addTechnology = () => {
    if (currentTech.trim() && !watchedStack.includes(currentTech.trim())) {
      setValue('stack', [...watchedStack, currentTech.trim()])
      setCurrentTech('')
    }
  }

  const removeTechnology = (tech: string) => {
    setValue('stack', watchedStack.filter(t => t !== tech))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTechnology()
    }
  }

  return (
    <div className="py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div>
          <Label>Title</Label>
          <Input {...register('title')} />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <Label>Description</Label>
          <Textarea {...register('description')} />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div>
          <Label>Project Image</Label>
          {/* No Controller needed - just pass state setter */}
          <SimpleFileUpload
            onFileChange={setSelectedFile}
            currentFile={selectedFile}
            previousImageUrl={project.imageUrl ?? undefined}
          />
        </div>

        <div>
          <Label>Technology Stack</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="React, Node.js..."
              value={currentTech}
              onChange={(e) => setCurrentTech(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button type="button" onClick={addTechnology} variant="outline" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {watchedStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {watchedStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                  {tech}
                  <button type="button" onClick={() => removeTechnology(tech)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          {errors.stack && <p className="text-sm text-red-500">{errors.stack.message}</p>}
        </div>

        <div>
          <Label>GitHub Repository</Label>
          <Input {...register('githubRepository')} />
        </div>

        <div>
          <Label>Website URL</Label>
          <Input {...register('website')} />
        </div>

        <Button type="submit" className="w-full" disabled={updateProject.isPending}>
          {updateProject.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}