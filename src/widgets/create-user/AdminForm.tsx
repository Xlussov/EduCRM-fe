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
import { AdminFormValues, BranchInfo } from '@/shared/types';
import { useCreateAdmin } from '@/api/users/mutations';
import { Loader2 } from 'lucide-react';

const adminSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  branch_ids: z.array(z.string()).min(1, 'Select at least one branch'),
});

export const AdminForm = ({ branches }: { branches: BranchInfo[] }) => {
  const anchor = useComboboxAnchor();
  const createAdmin = useCreateAdmin();

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      password: '',
      branch_ids: [],
    },
  });

  const onSubmit = (data: AdminFormValues) => {
    createAdmin.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                >
                  <ComboboxChips ref={anchor} className="w-full">
                    <ComboboxValue>
                      {(values: string[]) => (
                        <Fragment>
                          {values.map(val => {
                            const branchName = branches.find(b => b.id === val)?.name || val;
                            return <ComboboxChip key={val}>{branchName}</ComboboxChip>;
                          })}
                          <ComboboxChipsInput placeholder="Select branches..." />
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

        <Button type="submit" className="w-full mt-6" disabled={createAdmin.isPending}>
          {createAdmin.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Admin
        </Button>
      </form>
    </Form>
  );
};
