'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { SubjectInfo } from '@/shared/types';
import { Loader2 } from 'lucide-react';

export const subjectSchema = z.object({
  branch_id: z.string().min(1, 'Branch is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  initialData?: SubjectInfo;
  defaultBranchId: string;
  onSubmit: (data: SubjectFormValues) => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  isLoading?: boolean;
}

export const SubjectForm = ({
  initialData,
  defaultBranchId,
  onSubmit,
  onArchive,
  onUnarchive,
  isLoading,
}: SubjectFormProps) => {
  const isEditMode = !!initialData;
  const isArchived = initialData?.status === 'ARCHIVED';
  const isDisabled = isLoading || isArchived;

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      branch_id: initialData?.branch_id || defaultBranchId,
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  });

  const handleSubmit = (data: SubjectFormValues) => {
    onSubmit(data);
    form.reset(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Name</FormLabel>
              <FormControl>
                <Input placeholder="Mathematics" disabled={isDisabled} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Course covering algebra and geometry..." 
                  disabled={isDisabled} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4 pt-4">
          {!isArchived && (
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Save Changes' : 'Create Subject'}
            </Button>
          )}

          {isEditMode && !isArchived && onArchive && (
            <Button
              type="button"
              variant="destructive"
              onClick={onArchive}
              disabled={isLoading}
            >
              Archive Subject
            </Button>
          )}

          {isEditMode && isArchived && onUnarchive && (
            <Button
              type="button"
              variant="default"
              onClick={onUnarchive}
              disabled={isLoading}
            >
              Unarchive Subject
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};