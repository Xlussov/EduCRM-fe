'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { BranchInfo, Teacher } from '@/shared/types';
import { useState } from 'react';

const baseSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().optional(),
  branch_id: z.string().min(1, 'Select a branch'),
});

export type TeacherFormValues = z.infer<typeof baseSchema>;

const getValidationSchema = (isEditMode: boolean) =>
  baseSchema.superRefine((data, ctx) => {
    if (!isEditMode && (!data.password || data.password.length < 6)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must be at least 6 characters',
        path: ['password'],
      });
    }
  });

interface TeacherFormProps {
  branches: BranchInfo[];
  initialData?: Teacher;
  onSubmit: (data: TeacherFormValues) => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  isLoading?: boolean;
}

export const TeacherForm = ({
  branches,
  initialData,
  onSubmit,
  onArchive,
  onUnarchive,
  isLoading,
}: TeacherFormProps) => {
  const isEditMode = !!initialData;
  const isArchived = initialData?.status === 'ARCHIVED';
  const isDisabled = isLoading || isArchived;
  const [open, setOpen] = useState(false);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(getValidationSchema(isEditMode)),
    defaultValues: {
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      phone: initialData?.phone || '',
      password: '',
      branch_id: initialData?.branch_id || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isDisabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isDisabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" disabled={isDisabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {!isEditMode && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" disabled={isDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="branch_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Assign Branch</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={isDisabled}
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? branches.find(b => b.id === field.value)?.name
                        : 'Select a branch'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Search branch..." />
                    <CommandList>
                      <CommandEmpty>No branch found.</CommandEmpty>
                      <CommandGroup>
                        {branches.map(branch => (
                          <CommandItem
                            value={branch.name}
                            key={branch.id}
                            onSelect={() => {
                              form.setValue('branch_id', branch.id, { shouldValidate: true });
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                branch.id === field.value ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            {branch.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4 pt-4">
          {!isArchived && (
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Save Changes' : 'Create Teacher'}
            </Button>
          )}

          {isEditMode && !isArchived && (
            <Button
              type="button"
              variant="destructive"
              onClick={onArchive}
              disabled={isLoading}
            >
              Archive
            </Button>
          )}

          {isEditMode && isArchived && (
            <Button
              type="button"
              variant="default"
              onClick={onUnarchive}
              disabled={isLoading}
            >
              Unarchive
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};