'use client';

import { useActiveBranches } from '@/api/branches/queries';
import { TeacherForm } from './TeacherForm';

export default function CreateTeacher() {
  const { data: branches, isLoading } = useActiveBranches();

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-2xl">
      <h2 className="text-3xl font-bold tracking-tight">Create Teacher</h2>

      <TeacherForm branches={branches || []} />
    </div>
  );
}
