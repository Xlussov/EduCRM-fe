'use client';

import { useCreatePlan } from '@/api/plans/mutations';
import { PlanForm, PlanFormValues } from '@/components/plan-form';
import { Button } from '@/components/ui/button';
import { useBranchContext } from '@/providers/branch-provider';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreatePlan() {
  const router = useRouter();
  const { currentBranchId } = useBranchContext();
  const { mutate: createPlan, isPending } = useCreatePlan();

  if (!currentBranchId) {
    return <div className="p-8 pt-6">Please select a branch first.</div>;
  }

  const handleSubmit = (data: PlanFormValues) => {
    createPlan(data);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Create Subscription Plan</h2>
      </div>

      <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
        <PlanForm
          defaultBranchId={currentBranchId}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}