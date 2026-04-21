'use client';

import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateGroupLesson } from '@/api/lessons/mutations';
import { useActiveSubjects } from '@/api/subjects/queries';
import { useTeachers } from '@/api/teachers/queries';
import { useGroups } from '@/api/groups/queries';
import { useBranches } from '@/api/branches/queries';
import { TimePicker } from '@/components/ui/time-picker';

export const groupLessonSchema = z
  .object({
    branch_id: z.string().min(1, 'Required'),
    subject_id: z.string().min(1, 'Required'),
    teacher_id: z.string().min(1, 'Required'),
    group_id: z.string().min(1, 'Required'),
    date: z.date({ message: 'A date of lesson is required.' }),
    start_time: z.string().min(1, 'Required'),
    end_time: z.string().min(1, 'Required'),
  })
  .refine(data => data.end_time > data.start_time, {
    message: 'End time must be after start time',
    path: ['end_time'],
  });

type FormValues = z.infer<typeof groupLessonSchema>;

interface Props {
  branchId: string;
  onSuccess?: () => void;
}

export const GroupLessonForm = ({ branchId, onSuccess }: Props) => {
  const { data: branches, isLoading: isLoadingBranches } = useBranches();

  const form = useForm<FormValues>({
    resolver: zodResolver(groupLessonSchema),
    defaultValues: {
      branch_id: branchId || '',
      subject_id: '',
      teacher_id: '',
      group_id: '',
      start_time: '',
      end_time: '',
    },
  });

  const selectedBranchId = useWatch({ control: form.control, name: 'branch_id' });

  const { data: subjects, isLoading: isLoadingSubjects } = useActiveSubjects(selectedBranchId);
  const { data: teachers, isLoading: isLoadingTeachers } = useTeachers(selectedBranchId);
  const { data: groups, isLoading: isLoadingGroups } = useGroups(selectedBranchId);
  const { mutate, isPending } = useCreateGroupLesson(selectedBranchId);

  const onSubmit = (data: FormValues) => {
    const formattedDate = format(data.date, 'yyyy-MM-dd');
    mutate({ ...data, date: formattedDate }, { onSuccess });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="branch_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <Select
                disabled={isPending || isLoadingBranches}
                onValueChange={val => {
                  field.onChange(val);
                  form.setValue('subject_id', '');
                  form.setValue('teacher_id', '');
                  form.setValue('group_id', '');
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {branches
                    ?.filter(b => b.status !== 'ARCHIVED')
                    .map(b => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="subject_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select
                  disabled={!selectedBranchId || isPending || isLoadingSubjects}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects?.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teacher_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teacher</FormLabel>
                <Select
                  disabled={!selectedBranchId || isPending || isLoadingTeachers}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teachers?.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.first_name} {t.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="group_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Select
                disabled={!selectedBranchId || isPending || isLoadingGroups}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {groups
                    ?.filter(g => g.status !== 'ARCHIVED')
                    .map(g => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                      disabled={isPending}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <TimePicker value={field.value} onChange={field.onChange} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <TimePicker value={field.value} onChange={field.onChange} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isPending} className="w-full md:w-auto">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Schedule Group Lesson
          </Button>
        </div>
      </form>
    </Form>
  );
};
