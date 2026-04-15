'use client';

import { useCreateSubject } from '@/api/subjects/mutations';
import { SubjectForm, SubjectFormValues } from '@/components/subject-form';
import { Button } from '@/components/ui/button';
import { useBranchContext } from '@/providers/branch-provider';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateSubject() {
  const { currentBranchId } = useBranchContext();
  const { mutate: createSubject, isPending } = useCreateSubject();

  if (!currentBranchId) {
    return <div className="p-8 pt-6">Please select a branch first.</div>;
  }

  const handleSubmit = (data: SubjectFormValues) => {
    createSubject(data);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/subjects">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Create Subject</h2>
      </div>

      <SubjectForm
        defaultBranchId={currentBranchId}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </div>
  );
}
