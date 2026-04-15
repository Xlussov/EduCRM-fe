'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListSkeleton } from '@/components/list-skeleton';
import { UserCard } from '@/components/user-card';
import { useTeachers } from '@/api/teachers/queries';

export const TeachersList = () => {
  const { data: teachers, isLoading, isError } = useTeachers();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Teachers</h2>
        <Button asChild>
          <Link href="/teachers/create">
            <Plus className="h-4 w-4" />
            Create new teacher
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <div className="text-sm text-destructive">Failed to load teachers.</div>
      ) : teachers?.length === 0 ? (
        <div className="text-sm text-muted-foreground">No teachers found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teachers?.map(teacher => (
            <UserCard user={teacher} path='teachers' key={teacher.id} />
          ))}
        </div>
      )}
    </div>
  );
};