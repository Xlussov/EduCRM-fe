'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentCard } from '@/components/student-card'; 
import { useStudents } from '@/api/students/queries';
import { useBranchContext } from '@/providers/branch-provider';
import { ListSkeleton } from '@/components/list-skeleton';

export const StudentsList = () => {
  const { currentBranchId } = useBranchContext();
  const { data: students, isLoading, isError } = useStudents(currentBranchId || '');
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Students</h2>
        <Button asChild>
          <Link href="/students/create">
            <Plus className="h-4 w-4" />
            Create new student
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <div className="text-sm text-destructive">Failed to load students.</div>
      ) : students?.length === 0 ? (
        <div className="text-sm text-muted-foreground">No students found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students?.map((student) => (
            <StudentCard student={student} key={student.id} />
          ))}
        </div>
      )}
    </div>
  );
};