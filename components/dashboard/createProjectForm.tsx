'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Loader2 } from 'lucide-react'
import { SimpleFileUpload } from '../general/fileUpload'
import { useProjectMutations } from '@/hooks/useProject'

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  stack: z.array(z.string()).min(1, 'At least one technology is required'),
  website: z.string().optional(),
  githubRepository: z.string().optional(),
  // Remove imageFile from schema - handle separately
})

type FormData = z.infer<typeof formSchema>

export default function CreateProjectForm() {
  const [currentTech, setCurrentTech] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { createProject } = useProjectMutations()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      stack: [],
    },
  })

  const watchedStack = watch('stack')

  const onSubmit = (data: FormData) => {
    createProject.mutate(
      {
        ...data,
        imageFile: selectedFile,  // ✅ Pass selectedFile here
      },
      {
        onSuccess: () => {
          reset()
          setSelectedFile(null)
          setCurrentTech('')
        },
      }
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
    <div className="max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-2 flex-col">
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            placeholder="My awesome project"
            {...register('title')}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="flex gap-2 flex-col">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Tell us about your project..."
            rows={3}
            {...register('description')}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div>
          <Label>Technology Stack *</Label>
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
          <Label>Project Image</Label>
          {/* No Controller needed */}
          <SimpleFileUpload
            onFileChange={setSelectedFile}
            currentFile={selectedFile}
          // error={errors.imageFile?.message}
          />
        </div>

        <div className="flex gap-2 flex-col">
          <Label htmlFor="website">Website</Label>
          <Input id="website" placeholder="https://..." {...register('website')} />
        </div>

        <div className="flex gap-2 flex-col">
          <Label htmlFor="repo">GitHub Repository</Label>
          <Input id="repo" placeholder="https://github.com/..." {...register('githubRepository')} />
        </div>

        <div className="flex gap-3 pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={createProject.isPending} className="flex-1">
            {createProject.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}