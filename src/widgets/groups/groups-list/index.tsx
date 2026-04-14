'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useBranchContext } from '@/providers/branch-provider';
import { GroupCard } from '@/components/group-card';
import { useGroups } from '@/api/groups/queries';
import { ListSkeleton } from '@/components/list-skeleton';


export const GroupsList = () => {
  const { currentBranchId } = useBranchContext();
  const { data: groups, isLoading, isError } = useGroups(currentBranchId || '');
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Groups</h2>
        <Button asChild>
          <Link href="/groups/create">
            <Plus className="h-4 w-4" />
            Create new group
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <div className="text-sm text-destructive">Failed to load groups.</div>
      ) : groups?.length === 0 ? (
        <div className="text-sm text-muted-foreground">No groups found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups?.map((group) => (
            <GroupCard group={group} key={group.id} />
          ))}
        </div>
      )}
    </div>
  );
};