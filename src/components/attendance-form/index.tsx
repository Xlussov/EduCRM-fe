'use client';

import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMarkAttendance } from '@/api/attendance/mutations';

const attendanceSchema = z.object({
  attendance: z.array(
    z.object({
      student_id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      is_present: z.boolean(),
      notes: z.string().optional(),
    })
  ),
});

type FormValues = z.infer<typeof attendanceSchema>;

interface AttendanceFormProps {
  lessonId: string;
  initialData: FormValues['attendance'];
}

export const AttendanceForm = ({ lessonId, initialData }: AttendanceFormProps) => {
  const { mutateAsync: markAttendance, isPending } = useMarkAttendance(lessonId);

  const form = useForm<FormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      attendance: initialData,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "attendance",
  });

  useEffect(() => {
    form.reset({ attendance: initialData });
  }, [initialData, form]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      attendance: data.attendance.map(item => ({
        student_id: item.student_id,
        is_present: item.is_present,
        notes: item.notes || '',
      })),
    };

    await markAttendance(payload);
    form.reset(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-md border h-full">
          <Table className='h-full overflow-hidden'>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-24 text-center">Present</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="w-1/2">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((fieldItem, index) => (
                <TableRow key={fieldItem.id}>
                  <TableCell className="text-center">
                    <FormField
                      control={form.control}
                      name={`attendance.${index}.is_present`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isPending}
                              className="h-5 w-5"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {fieldItem.first_name} {fieldItem.last_name}
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`attendance.${index}.notes`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Add optional notes..." 
                              disabled={isPending}
                              className="bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          {form.formState.isDirty && (
            <span className="text-sm font-medium text-muted-foreground animate-pulse">
              Unsaved changes
            </span>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Attendance
          </Button>
        </div>
      </form>
    </Form>
  );
};