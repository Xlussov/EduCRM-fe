'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeacherForm, TeacherFormValues } from '@/components/teacher-form';
import { useActiveBranches } from '@/api/branches/queries';
import { useCreateTeacher } from '@/api/teachers/mutations';
import { useRouter } from 'next/navigation';

export default function CreateTeacher() {
  const router = useRouter();
  const { data: branches, isLoading: isBranchesLoading } = useActiveBranches();
  const createTeacher = useCreateTeacher();

  const onSubmit = (data: TeacherFormValues) => {
    createTeacher.mutate(data);
  };

  if (isBranchesLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Teacher</h2>
          <p className="text-muted-foreground">Add a new teacher and assign them to a branch.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <TeacherForm
          branches={branches || []}
          onSubmit={onSubmit}
          isLoading={createTeacher.isPending}
        />
      </div>
    </div>
  );
}