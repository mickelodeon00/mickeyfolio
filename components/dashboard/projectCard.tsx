'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { handleMutation } from '@/lib/utils';

type DeleteMutation = UseMutationResult<
  { message: string }, // Return type of your mutationFn
  Error, // Error type
  string, // Variables type (what you pass to mutate())
  unknown // Context type
>;
export interface ProjectCardProps {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  stack: string[];
  slug?: string;
  onDelete: DeleteMutation;
  EditFormComponent: React.ComponentType<{ defaultValues: any; onClose: () => void }>;
  formInitialValues: any;
}

export default function ProjectCard({
  id,
  title,
  imageUrl,
  description,
  stack,
  slug,
  onDelete,
  EditFormComponent,
  formInitialValues,
}: ProjectCardProps) {
  const { toast } = useToast();
  const [openSheet, setOpenSheet] = useState(false);

  return (
    <Card className="hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* <div className="relative h-48 w-full">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div> */}

      <CardHeader>
        <div className="flex justify-between gap-4 items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1 text-sm text-muted-foreground">
              {description}
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
                <EditFormComponent defaultValues={formInitialValues} onClose={() => setOpenSheet(false)} />
              </SheetContent>
            </Sheet>

            <AlertDialog>
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
                    Are you sure you want to delete “{title}”? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      handleMutation(onDelete, id);
                      toast({ title: 'Deleted', description: 'Project removed.' });
                    }}
                  >
                    {onDelete?.isPending ? 'Deleting' : 'Delete'}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {stack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs px-2 py-1">
              {tech}
            </Badge>
          ))}
        </div>

        {/* {slug && (
          <div className="mt-4">
            <Link href={`/projects/${slug}`} className="text-sm text-primary hover:underline">
              View Project →
            </Link>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
