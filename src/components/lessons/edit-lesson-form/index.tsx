'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUpdateLesson } from '@/api/lessons/mutations';
import { useActiveSubjects } from '@/api/subjects/queries';
import { useTeachers } from '@/api/teachers/queries';
import { LessonInfo } from '@/shared/types';

export const editLessonSchema = z.object({
  subject_id: z.string().min(1, 'Required'),
  teacher_id: z.string().min(1, 'Required'),
  date: z.date({ message: "A date of lesson is required." }),
  start_time: z.string().min(1, 'Required'),
  end_time: z.string().min(1, 'Required'),
}).refine(
  (data) => data.end_time > data.start_time,
  {
    message: "End time must be after start time",
    path: ["end_time"],
  }
);

type FormValues = z.infer<typeof editLessonSchema>;

interface Props {
  lesson: LessonInfo;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EditLessonForm = ({ lesson, onSuccess, onCancel }: Props) => {
  const { data: subjects, isLoading: isLoadingSubjects } = useActiveSubjects(lesson.branch_id);
  const { data: teachers, isLoading: isLoadingTeachers } = useTeachers(lesson.branch_id);
  const { mutate, isPending } = useUpdateLesson();

  const form = useForm<FormValues>({
    resolver: zodResolver(editLessonSchema),
    defaultValues: {
      subject_id: lesson.subject_id,
      teacher_id: lesson.teacher_id,
      date: parse(lesson.date, 'yyyy-MM-dd', new Date()),
      start_time: lesson.start_time.slice(0, 5), 
      end_time: lesson.end_time.slice(0, 5), 
    },
  });

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
    };
    
    mutate({ id: lesson.id, data: payload }, { onSuccess });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="subject_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select disabled={isPending || isLoadingSubjects} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
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
                <Select disabled={isPending || isLoadingTeachers} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teachers?.map((t) => <SelectItem key={t.id} value={t.id}>{t.first_name} {t.last_name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      disabled={isPending}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
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
                <FormControl><Input type="time" disabled={isPending} {...field} /></FormControl>
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
                <FormControl><Input type="time" disabled={isPending} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};