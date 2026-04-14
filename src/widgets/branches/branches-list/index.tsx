'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BranchCard } from '@/components/branch-card';
import { useBranches } from '@/api/branches/queries';
import { ListSkeleton } from '@/components/list-skeleton';

export const BranchesList = () => {
  const { data: branches, isLoading, isError } = useBranches();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Branches</h2>
        <Button asChild>
          <Link href="/branches/create">
            <Plus className="h-4 w-4" />
            Create new branch
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <div className="text-sm text-destructive">Failed to load branches.</div>
      ) : branches?.length === 0 ? (
        <div className="text-sm text-muted-foreground">No branches found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {branches?.map(branch => (
            <BranchCard branch={branch} key={branch.id} />
          ))}
        </div>
      )}
    </div>
  );
};
