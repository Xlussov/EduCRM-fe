'use client';

import { useCreateStudent } from '@/api/students/mutations';
import { StudentForm } from '@/components/student-form';
import { Button } from '@/components/ui/button';
import { useBranchContext } from '@/providers/branch-provider';
import { ROUTES } from '@/shared/routes';
import { StudentFormValues } from '@/shared/types';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateStudent() {
  const { currentBranchId } = useBranchContext();
  const createMutation = useCreateStudent();
  const router = useRouter();

  if (!currentBranchId) {
    return <div>Please select a branch first.</div>;
  }

  const handleSubmit = (data: StudentFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => router.push(ROUTES.STUDENTS),
    });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/branches">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Add New Student</h2>
      </div>
      <StudentForm
        defaultBranchId={currentBranchId}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
