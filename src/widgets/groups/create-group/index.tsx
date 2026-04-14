'use client';

import { useCreateGroup } from '@/api/groups/mutations';
import { useBranches } from '@/api/branches/queries';
import { GroupForm } from '@/components/group-form';
import { Button } from '@/components/ui/button';
import { useBranchContext } from '@/providers/branch-provider';
import { ROUTES } from '@/shared/routes';
import { GroupFormValues } from '@/shared/types';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateGroup() {
  const { currentBranchId } = useBranchContext();
  const { data: branches = [], isLoading: isLoadingBranches } = useBranches();
  const createMutation = useCreateGroup();
  const router = useRouter();

  if (!currentBranchId || isLoadingBranches) {
    return <div className="p-8">Loading...</div>;
  }

  const handleSubmit = (data: GroupFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => router.push(ROUTES.GROUPS),
    });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/groups">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Create Group</h2>
      </div>
      <GroupForm
        defaultBranchId={currentBranchId}
        branches={branches}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}