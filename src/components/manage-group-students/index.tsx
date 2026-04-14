'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Student } from '@/shared/types';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSyncGroupStudents } from '@/api/groups/mutations';
import { ArchivedPlug } from '../archived-plug';

const schema = z.object({
  student_ids: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

interface ManageGroupStudentsProps {
  groupId: string;
  allStudents: Student[];
  initialStudentIds: string[];
}

export const ManageGroupStudents = ({
  groupId,
  allStudents,
  initialStudentIds,
}: ManageGroupStudentsProps) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      student_ids: initialStudentIds,
    },
  });

  const { isDirty } = form.formState;
  const syncStudents = useSyncGroupStudents(groupId);

  const onSubmit = async (data: FormValues) => {
    setIsSyncing(true);

    try {
      await syncStudents.mutateAsync(data.student_ids);
      form.reset({ student_ids: data.student_ids });
      toast.success('Group students updated successfully');
    } catch (error) {
      toast.error('Failed to update group students');
    } finally {
      setIsSyncing(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <FormField
                    control={form.control}
                    name="student_ids"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={
                              field.value?.length === allStudents.length && allStudents.length > 0
                            }
                            onCheckedChange={checked => {
                              return checked
                                ? field.onChange(allStudents.map(s => s.id))
                                : field.onChange([]);
                            }}
                            disabled={isSyncing}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    No students found in this branch.
                  </TableCell>
                </TableRow>
              ) : (
                allStudents.map(student => (
                  <FormField
                    key={student.id}
                    control={form.control}
                    name="student_ids"
                    render={({ field }) => {
                      return (
                        <TableRow>
                          <TableCell className="text-center flex items-center">
                            <FormItem>
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(student.id)}
                                  onCheckedChange={checked => {
                                    return checked
                                      ? field.onChange([...field.value, student.id])
                                      : field.onChange(
                                          field.value?.filter(value => value !== student.id),
                                        );
                                  }}
                                  disabled={isSyncing}
                                />
                              </FormControl>
                            </FormItem>
                          </TableCell>
                          <TableCell className="font-medium ">
                            <span className="pr-2">
                              {student.first_name} {student.last_name}
                            </span>
                            {student.status === 'ARCHIVED' && <ArchivedPlug />}
                          </TableCell>
                          <TableCell>{student.email || '—'}</TableCell>
                          <TableCell>{student.phone}</TableCell>
                        </TableRow>
                      );
                    }}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-4">
          {isDirty && (
            <span className="text-sm font-medium text-muted-foreground animate-pulse">
              Unsaved changes 
            </span>
          )}
          <Button type="submit" disabled={isSyncing || !isDirty}>
            {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDirty ? "Click to save" : "No changes to save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};