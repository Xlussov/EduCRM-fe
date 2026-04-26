'use client';

import { useParams, useRouter } from 'next/navigation';
import { GroupForm } from '@/components/group-form';
import { useUpdateGroup, useArchiveGroup, useUnarchiveGroup } from '@/api/groups/mutations';
import { useGroupById } from '@/api/groups/queries';
import { useBranches } from '@/api/branches/queries';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { GroupFormValues } from '@/shared/types';

export default function EditGroup() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: group, isLoading: isFetchingGroup } = useGroupById(id);
  const { data: branches = [], isLoading: isFetchingBranches } = useBranches();

  const updateGroup = useUpdateGroup(id);
  const archiveGroup = useArchiveGroup(id);
  const unarchiveGroup = useUnarchiveGroup(id);

  const onSubmit = (data: GroupFormValues) => {
    updateGroup.mutate(data);
  };

  const onArchive = () => {
    archiveGroup.mutate();
  };

  const onUnarchive = () => {
    unarchiveGroup.mutate();
  };

  const isPending = updateGroup.isPending || archiveGroup.isPending || unarchiveGroup.isPending;
  const isLoading = isFetchingGroup || isFetchingBranches;

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Group</h2>
      </div>

      {group && (
        <GroupForm
          initialData={group}
          defaultBranchId={group.branch_id}
          branches={branches}
          onSubmit={onSubmit}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
          isLoading={isPending}
        />
      )}
    </div>
  );
}
