'use client';

import { useParams } from 'next/navigation';
import { BranchForm, BranchFormValues } from '@/components/branch-form';
import { useUpdateBranch, useArchiveBranch } from '@/api/branches/mutations';
import { useBranchById } from '@/api/branches/queries';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function EditBranch() {
  const params = useParams();
  const id = params.id as string;

  const { data: branch, isLoading: isFetching } = useBranchById(id);
  const updateBranch = useUpdateBranch(id);
  const archiveBranch = useArchiveBranch(id);

  const onSubmit = (data: BranchFormValues) => {
    updateBranch.mutate(data);
  };

  const onArchive = () => {
    archiveBranch.mutate();
  };

  const isPending = updateBranch.isPending || archiveBranch.isPending;

  if (isFetching) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/branches">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Branch</h2>
      </div>

      {branch && (
        <BranchForm
          initialData={branch}
          onSubmit={onSubmit}
          onArchive={onArchive}
          isLoading={isPending}
        />
      )}
    </div>
  );
}
