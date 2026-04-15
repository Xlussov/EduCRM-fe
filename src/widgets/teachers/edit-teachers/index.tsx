'use client';

import { useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TeacherForm, TeacherFormValues } from '@/components/teacher-form';
import { useActiveBranches } from '@/api/branches/queries';
import { useTeacherById } from '@/api/teachers/queries';
import { useUpdateTeacher, useArchiveTeacher, useUnarchiveTeacher } from '@/api/teachers/mutations';

export default function EditTeacher() {
  const params = useParams();
  const id = params.id as string;

  const { data: branches, isLoading: isBranchesLoading } = useActiveBranches();
  const { data: teacher, isLoading: isTeacherLoading } = useTeacherById(id);
  
  const updateTeacher = useUpdateTeacher(id);
  const archiveTeacher = useArchiveTeacher(id);
  const unarchiveTeacher = useUnarchiveTeacher(id);

  const isPending = updateTeacher.isPending || archiveTeacher.isPending || unarchiveTeacher.isPending;

  const onSubmit = (data: TeacherFormValues) => {
    const { password, ...payload } = data;
    
    updateTeacher.mutate(payload);
  };

  if (isBranchesLoading || isTeacherLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!teacher) {
    return <div className="p-8">Teacher not found.</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/teachers">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Teacher</h2>
          <p className="text-muted-foreground">Update teacher details and branch assignment.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <TeacherForm
          branches={branches || []}
          initialData={teacher}
          onSubmit={onSubmit}
          onArchive={() => archiveTeacher.mutate()}
          onUnarchive={() => unarchiveTeacher.mutate()}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}