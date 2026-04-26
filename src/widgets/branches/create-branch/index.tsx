'use client';

import { useCreateBranch } from '@/api/branches/mutations';
import { BranchForm, BranchFormValues } from '@/components/branch-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateBranch() {
  const router = useRouter();
  const createBranch = useCreateBranch();

  const onSubmit = (data: BranchFormValues) => {
    createBranch.mutate(data);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Create Branch</h2>
      </div>
      <BranchForm onSubmit={onSubmit} />
    </div>
  );
}
