'use client';

import React, { Fragment } from 'react';
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
import { useCreateLessonTemplate } from '@/api/lessons/mutations';
import { useActiveSubjects } from '@/api/subjects/queries';
import { useTeachers } from '@/api/teachers/queries';
import { useStudents } from '@/api/students/queries';
import { useGroups } from '@/api/groups/queries';
import { useBranches } from '@/api/branches/queries';
import { TimePicker } from '@/components/ui/time-picker';

const DAYS_OF_WEEK = [
  { id: '1', name: 'Monday' },
  { id: '2', name: 'Tuesday' },
  { id: '3', name: 'Wednesday' },
  { id: '4', name: 'Thursday' },
  { id: '5', name: 'Friday' },
  { id: '6', name: 'Saturday' },
  { id: '0', name: 'Sunday' },
];

export const templateLessonSchema = z
  .object({
    branch_id: z.string().min(1, 'Required'),
    target_type: z.enum(['STUDENT', 'GROUP']),
    subject_id: z.string().min(1, 'Required'),
    teacher_id: z.string().min(1, 'Required'),
    student_id: z.string().optional(),
    group_id: z.string().optional(),
    days_of_week: z.array(z.string()).min(1, 'Select at least one day'),
    start_date: z.date({ message: 'Start date is required' }),
    end_date: z.date({ message: 'End date is required' }),
    start_time: z.string().min(1, 'Required'),
    end_time: z.string().min(1, 'Required'),
  })
  .superRefine((data, ctx) => {
    if (data.target_type === 'STUDENT' && !data.student_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['student_id'], message: 'Required' });
    }
    if (data.target_type === 'GROUP' && !data.group_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['group_id'], message: 'Required' });
    }

    if (data.end_date < data.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end_date'],
        message: 'End date cannot be before start date',
      });
    }

    if (data.end_time <= data.start_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end_time'],
        message: 'End time must be after start time',
      });
    }
  });

type FormValues = z.infer<typeof templateLessonSchema>;

interface Props {
  branchId: string;
  onSuccess?: () => void;
}

export const TemplateLessonForm = ({ branchId, onSuccess }: Props) => {
  const anchor = useComboboxAnchor();
  const { data: branches, isLoading: isLoadingBranches } = useBranches();

  const form = useForm<FormValues>({
    resolver: zodResolver(templateLessonSchema),
    defaultValues: {
      branch_id: branchId || '',
      target_type: 'STUDENT',
      subject_id: '',
      teacher_id: '',
      student_id: '',
      group_id: '',
      days_of_week: [],
      start_time: '',
      end_time: '',
    },
  });

  const targetType = useWatch({ control: form.control, name: 'target_type' });
  const selectedBranchId = useWatch({ control: form.control, name: 'branch_id' });

  const { data: subjects, isLoading: isLoadingSubjects } = useActiveSubjects(selectedBranchId);
  const { data: teachers, isLoading: isLoadingTeachers } = useTeachers(selectedBranchId);
  const { data: students, isLoading: isLoadingStudents } = useStudents(selectedBranchId);
  const { data: groups, isLoading: isLoadingGroups } = useGroups(selectedBranchId);
  const { mutate, isPending } = useCreateLessonTemplate(selectedBranchId);

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      days_of_week: data.days_of_week.map(Number),
      student_id: data.target_type === 'STUDENT' ? data.student_id : undefined,
      group_id: data.target_type === 'GROUP' ? data.group_id : undefined,
      start_date: format(data.start_date, 'yyyy-MM-dd'),
      end_date: format(data.end_date, 'yyyy-MM-dd'),
    };

    mutate(payload, { onSuccess });
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
                  form.setValue('student_id', '');
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

        <FormField
          control={form.control}
          name="target_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Type</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={val => {
                  field.onChange(val);
                  form.setValue('student_id', '');
                  form.setValue('group_id', '');
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STUDENT">Individual Student</SelectItem>
                  <SelectItem value="GROUP">Group of Students</SelectItem>
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

        {targetType === 'STUDENT' ? (
          <FormField
            control={form.control}
            name="student_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student</FormLabel>
                <Select
                  disabled={!selectedBranchId || isPending || isLoadingStudents}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students?.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.first_name} {s.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
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
        )}

        {/* МУЛЬТИСЕЛЕКТ ДЛЯ ДНЕЙ НЕДЕЛИ */}
        <FormField
          control={form.control}
          name="days_of_week"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Days of the Week</FormLabel>
              <FormControl>
                <Combobox
                  multiple
                  autoHighlight
                  items={DAYS_OF_WEEK}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <ComboboxChips ref={anchor} className="w-full">
                    <ComboboxValue>
                      {(values: string[]) => (
                        <Fragment>
                          {values.map(val => {
                            const dayName = DAYS_OF_WEEK.find(d => d.id === val)?.name || val;
                            return <ComboboxChip key={val}>{dayName}</ComboboxChip>;
                          })}
                          <ComboboxChipsInput placeholder="Select days..." disabled={isPending} />
                        </Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No day found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: (typeof DAYS_OF_WEEK)[0]) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
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
        </div>

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
            Generate Schedule
          </Button>
        </div>
      </form>
    </Form>
  );
};
