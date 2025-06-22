'use client';

import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { SimpleFileUpload } from '../general/fileUpload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/app/actions/blogpost';
import { handleMutation } from '@/lib/utils';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  stack: z.array(z.string()).min(1, 'At least one technology is required'),
  website: z.string().optional(),
  github_repository: z.string().optional(),
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, 'File size must be less than 2MB')
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateProjectForm() {
  const [currentTech, setCurrentTech] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      stack: [],
    },
  });

  const watchedStack = watch('stack');
  const queryClient = useQueryClient()
  const createProjectMutation = useMutation({

    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast("Project created", {
        description: 'Project has been successfully created',
        position: 'bottom-right'
      })
    },
    onError: () => {
      toast("Error Occured", {
        description: 'Faild to create project',
        position: 'bottom-right'
      })
    }
  })

  const onSubmit = async (data: FormData) => {

    handleMutation(createProjectMutation, data)
    // Reset form
    reset();
    setSelectedFile(null);
    setCurrentTech('');
  };

  const addTechnology = () => {
    if (currentTech.trim() && !watchedStack.includes(currentTech.trim())) {
      setValue('stack', [...watchedStack, currentTech.trim()]);
      setCurrentTech('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setValue('stack', watchedStack.filter(tech => tech !== techToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setValue('imageFile', file || undefined);
  };

  return (
    <div className="max-w-lg mx-auto p-4">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div className='flex gap-2 flex-col'>
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            placeholder="My awesome project"
            {...register('title')}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className='flex gap-2 flex-col'>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Tell us about your project..."
            rows={3}
            {...register('description')}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Technology Stack */}
        <div>
          <Label>Technology Stack *</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="React, Node.js..."
              value={currentTech}
              onChange={(e) => setCurrentTech(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addTechnology}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {watchedStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {watchedStack.map((tech, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {errors.stack && (
            <p className="text-sm text-red-500 mt-1">{errors.stack.message}</p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <Label>Project Image</Label>
          <div className="mt-2">
            <Controller
              name="imageFile"
              control={control}
              render={() => (
                <SimpleFileUpload
                  onFileChange={handleFileChange}
                  currentFile={selectedFile}
                  error={errors.imageFile?.message}
                />
              )}
            />
          </div>
        </div>
        {/* webbsite */}
        <div className='flex gap-2 flex-col'>
          <Label htmlFor="website">Website </Label>
          <Input
            id="website"
            placeholder="Website ..."
            {...register('website')}
          />

        </div>
        {/* github repo */}
        <div className='flex gap-2 flex-col'>
          <Label htmlFor="repo">repository </Label>
          <Input
            id="repo"
            placeholder="github repository ..."
            {...register('github_repository')}
          />

        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
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
  );
}