'use client';

import React, { Fragment } from 'react';
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
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { BranchInfo, User } from '@/shared/types';
import { Loader2 } from 'lucide-react';

const baseSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().optional(),
  branch_ids: z.array(z.string()).min(1, 'Select at least one branch'),
});

export type AdminFormValues = z.infer<typeof baseSchema>;

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

interface AdminFormProps {
  branches: BranchInfo[];
  initialData?: User;
  onSubmit: (data: AdminFormValues) => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  isLoading?: boolean;
}

export const AdminForm = ({
  branches,
  initialData,
  onSubmit,
  onArchive,
  onUnarchive,
  isLoading,
}: AdminFormProps) => {
  const anchor = useComboboxAnchor();
  const isEditMode = !!initialData;
  const isArchived = initialData?.status === 'ARCHIVED';
  const isDisabled = isLoading || isArchived;

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(getValidationSchema(isEditMode)),
    defaultValues: {
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      phone: initialData?.phone || '',
      password: '',
      branch_ids: initialData?.branches.map((b) => b.id) || [],
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
          name="branch_ids"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Assign Branches</FormLabel>
              <FormControl>
                <Combobox
                  multiple
                  autoHighlight
                  items={branches}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isDisabled}
                >
                  <ComboboxChips ref={anchor} className="w-full">
                    <ComboboxValue>
                      {(values: string[]) => (
                        <Fragment>
                          {values.map((val) => {
                            const branchName = branches.find((b) => b.id === val)?.name || val;
                            return <ComboboxChip key={val}>{branchName}</ComboboxChip>;
                          })}
                          <ComboboxChipsInput
                            placeholder="Select branches..."
                            disabled={isDisabled}
                          />
                        </Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No branch found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: BranchInfo) => (
                        <ComboboxItem key={item.id} value={item.id}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4 pt-4">
          {!isArchived && (
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Save Changes' : 'Create Admin'}
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