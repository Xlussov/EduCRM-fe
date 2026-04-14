'use client';

import { useParams } from 'next/navigation';
import { StudentForm } from '@/components/student-form'; 
import { useUpdateStudent, useArchiveStudent, useUnarchiveStudent } from '@/api/students/mutations';
import { useStudentById } from '@/api/students/queries';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { StudentFormValues } from '@/shared/types';

export default function EditStudent() {
  const params = useParams();
  const id = params.id as string;

  const { data: student, isLoading: isFetching } = useStudentById(id);
  
  const updateStudent = useUpdateStudent(id);
  const archiveStudent = useArchiveStudent(id);
  const unarchiveStudent = useUnarchiveStudent(id);

  const onSubmit = (data: StudentFormValues) => {
    updateStudent.mutate(data);
  };

  const onArchive = () => {
    archiveStudent.mutate();
  };

  const onUnarchive = () => {
    unarchiveStudent.mutate();
  };


  const isPending = updateStudent.isPending || archiveStudent.isPending || unarchiveStudent.isPending;

  if (isFetching) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/students">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Student</h2>
      </div>

      {student && (
        <StudentForm
          initialData={student}
          defaultBranchId={student.branch_id}
          onSubmit={onSubmit}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
          isLoading={isPending}
        />
      )}
    </div>
  );
}