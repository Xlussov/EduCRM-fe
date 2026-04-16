'use client';

import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useActiveSubjects } from '@/api/subjects/queries';

export const planSchema = z.object({
  branch_id: z.string().min(1, 'Branch is required'),
  name: z.string().min(1, 'Plan name is required'),
  type: z.enum(['INDIVIDUAL', 'GROUP']),
  subject_ids: z.array(z.string()).min(1, 'Select at least one subject'),
  pricing_grid: z
    .array(
      z.object({
        lessons: z.number().min(1, 'Min 1 lesson'),
        price: z.number().positive('Price must be greater than 0'), 
      })
    )
    .min(1, 'Add at least one pricing tier')
    .refine(
      (grid) => {
        const lessonCounts = grid.map((tier) => tier.lessons);
        return new Set(lessonCounts).size === lessonCounts.length;
      },
      { message: 'Lesson counts must be unique. You cannot have multiple tiers for the same number of lessons.' }
    ),
});

export type PlanFormValues = z.infer<typeof planSchema>;

interface PlanFormProps {
  defaultBranchId: string;
  onSubmit: (data: PlanFormValues) => void;
  isLoading?: boolean;
}

export const PlanForm = ({ defaultBranchId, onSubmit, isLoading }: PlanFormProps) => {
  const { data: subjects, isLoading: isSubjectsLoading } = useActiveSubjects(defaultBranchId);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      branch_id: defaultBranchId,
      name: '',
      type: 'INDIVIDUAL',
      subject_ids: [],
      pricing_grid: [{ lessons: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'pricing_grid',
  });

  const { isDirty } = form.formState;

  const handleSubmit = (data: PlanFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 max-w-2xl">
        {isDirty && (
          <div className="text-sm text-amber-500 animate-pulse font-medium">
            Unsaved changes detected
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                  <Input placeholder="Standard Individual" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Type</FormLabel>
                <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="GROUP">Group</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject_ids"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Linked Subjects</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Select the subjects this pricing plan applies to.
                </div>
              </div>
              {isSubjectsLoading ? (
                <div className="text-sm text-muted-foreground flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading subjects...
                </div>
              ) : subjects?.length === 0 ? (
                <div className="text-sm text-destructive">
                  No active subjects found. Create a subject first.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 border rounded-md p-4 bg-muted/20">
                  {subjects?.map((subject) => (
                    <FormField
                      key={subject.id}
                      control={form.control}
                      name="subject_ids"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={subject.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                disabled={isLoading}
                                checked={field.value?.includes(subject.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, subject.id])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== subject.id)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {subject.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-medium">Pricing Grid</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ lessons: 1, price: 0 })}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tier
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="text-sm text-muted-foreground italic">No pricing tiers added.</div>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
              <FormField
                control={form.control}
                name={`pricing_grid.${index}.lessons`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className={index !== 0 ? 'sr-only' : ''}>Lessons per month</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        disabled={isLoading}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`pricing_grid.${index}.price`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className={index !== 0 ? 'sr-only' : ''}>Price per lesson ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        disabled={isLoading}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`text-destructive ${index === 0 ? 'mt-5' : 'mt-0'}`}
                onClick={() => remove(index)}
                disabled={isLoading || fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {form.formState.errors.pricing_grid?.root && (
            <div className="text-[0.8rem] font-medium text-destructive mt-2">
              {form.formState.errors.pricing_grid.root.message}
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading || !isDirty || (subjects?.length === 0)}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Subscription Plan
        </Button>
      </form>
    </Form>
  );
};