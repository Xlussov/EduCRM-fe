'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlanCard } from '@/components/plan-card';
import { usePlans } from '@/api/plans/queries';
import { useBranchContext } from '@/providers/branch-provider';
import { ListSkeleton } from '@/components/list-skeleton';

export default function PlansList() {
  const { currentBranchId } = useBranchContext();
  const { data: plans, isLoading, isError } = usePlans(currentBranchId || '');

  if (!currentBranchId) {
    return <div className="p-8 pt-6">Please select a branch first.</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Subscription Plans</h2>
        <Button asChild>
          <Link href="/plans/create">
            <Plus className="h-4 w-4" />
            Create new plan
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <div className="text-sm text-destructive">Failed to load plans.</div>
      ) : plans?.length === 0 ? (
        <div className="text-sm text-muted-foreground">No plans found for this branch.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans?.map(plan => (
            <PlanCard plan={plan} key={plan.id} />
          ))}
        </div>
      )}
    </div>
  );
}