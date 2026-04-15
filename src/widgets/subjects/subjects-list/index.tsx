'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SubjectCard } from '@/components/subject-card';
import { useSubjects } from '@/api/subjects/queries';
import { useBranchContext } from '@/providers/branch-provider';
import { ListSkeleton } from '@/components/list-skeleton';

export default function SubjectsList() {
  const { currentBranchId } = useBranchContext();
  const { data: subjects, isLoading, isError } = useSubjects(currentBranchId || '');

  if (!currentBranchId) {
    return <div className="p-8 pt-6">Please select a branch first.</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Subjects</h2>
        <Button asChild>
          <Link href="/subjects/create">
            <Plus className="h-4 w-4" />
            Create new subject
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <div className="text-sm text-destructive">Failed to load subjects.</div>
      ) : subjects?.length === 0 ? (
        <div className="text-sm text-muted-foreground">No subjects found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects?.map(subject => (
            <SubjectCard subject={subject} key={subject.id} />
          ))}
        </div>
      )}
    </div>
  );
}