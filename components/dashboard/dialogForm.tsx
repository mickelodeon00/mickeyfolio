'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReactElement } from 'react';

type DialogFormProps = {
  trigger: ReactElement;
  form: ReactElement;
  title: string;
  description?: string;
  width?: string; // Tailwind class (e.g., 'sm:max-w-lg')
};

const DialogForm = ({
  trigger,
  form,
  title,
  description,
  width = 'sm:max-w-lg', // Default responsive width
}: DialogFormProps) => {
  return (

    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={`w-full ${width} max-h-[80vh] overflow-y-auto p-0 `}>
        <DialogHeader className="border-b p-4 bg-gray-50/80 dark:bg-gray-900/80">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2 text-base">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="p-4">{form}</div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
