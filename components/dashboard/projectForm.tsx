'use client';

import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject } from '@/app/actions/blogpost';
import { toast } from '../ui/use-toast';
import { handleMutation } from '@/lib/utils';
import { useState } from 'react';
import { SimpleFileUpload } from '../general/fileUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import { Badge } from '../ui/badge';

export interface EditProjectFormProps {
  defaultValues: {
    id: string; // Assuming you have an ID to identify the project
    title: string;
    description: string;
    imageUrl: string;
    stack: string[];
    website: string;
    github_repository: string;
  };
  onClose: () => void;
}

export type PojectFormData = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageFile?: File; // optional for image upload
  stack: string; // comma-separated string
};

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

export default function EditProjectForm({ defaultValues, onClose }: EditProjectFormProps) {
  const queryClient = useQueryClient();
  const [currentTech, setCurrentTech] = useState('');

  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      })
      reset()
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    },
  });


  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { id, ...formDefault } = defaultValues

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
      ...formDefault,
      imageFile: undefined
    },
  });

  const watchedStack = watch('stack');

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setValue('imageFile', file || undefined);
  };

  const addTechnology = () => {
    if (currentTech.trim() && !watchedStack.includes(currentTech.trim())) {
      setValue('stack', [...watchedStack, currentTech.trim()]);
      setCurrentTech('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setValue('stack', watchedStack.filter(tech => tech !== techToRemove));
  };

  const onSubmit = async (data: FormData) => {
    const transformed = {
      ...data,
      id: defaultValues.id,
    }
    handleMutation(updateMutation, transformed)
    onClose();
  };

  return (
    <div className=' py-8'>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div>
          <Label>Title</Label>
          <Input {...register('title')} />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea {...register('description')} />
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
                  previousImageUrl={`api/images/o/${formDefault?.imageUrl}`}
                />
              )}
            />
          </div>
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
        <div>
          <Label>GitHub Repository</Label>
          <Input {...register('github_repository')} />
        </div>
        <div>
          <Label>Website URL</Label>
          <Input {...register('website')} />
        </div>


        <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
          {
            updateMutation.isPending ? 'Saving...' : 'Save Changes'
          }
        </Button>
      </form>
    </div>
  );
}
