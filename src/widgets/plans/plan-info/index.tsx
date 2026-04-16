'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Users, User, Archive, ArchiveRestore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePlanById } from '@/api/plans/queries';
import { useArchivePlan, useUnarchivePlan } from '@/api/plans/mutations';
import { useBranchContext } from '@/providers/branch-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { ArchivedPlug } from '@/components/archived-plug';

export default function PlanInfo() {
  const params = useParams();
  const planId = params.id as string;
  const { currentBranchId } = useBranchContext();

  const { data: plan, isLoading, isError } = usePlanById(planId);
  const archivePlan = useArchivePlan(planId, currentBranchId || '');
  const unarchivePlan = useUnarchivePlan(planId, currentBranchId || '');

  const isPending = archivePlan.isPending || unarchivePlan.isPending;

  if (isLoading) {
    return (
      <div className="p-8 pt-6 space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[400px] w-full max-w-3xl" />
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="p-8 pt-6">
        <div className="text-destructive">Failed to load plan details.</div>
      </div>
    );
  }

  const isArchived = plan.status === 'ARCHIVED';
  console.log(isArchived);
  
  const TypeIcon = plan.type === 'GROUP' ? Users : User;

  const onArchive = () => {
    archivePlan.mutate();
    console.log('Archiving plan:', plan.id, 'Current branch:', currentBranchId);
    
  }
  const onUnarchive = () => unarchivePlan.mutate();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/plans">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Plan Details</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="flex items-center mt-2">
                  <TypeIcon className="mr-2 h-4 w-4" />
                  {plan.type === 'GROUP' ? 'Group Lessons' : 'Individual Lessons'}
                </CardDescription>
              </div>
              {isArchived && <ArchivedPlug />}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Linked Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {plan.subjects.map((subject) => (
                  <span
                    key={subject.id}
                    className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-sm font-semibold text-secondary-foreground"
                  >
                    {subject.name}
                  </span>
                ))}
                {plan.subjects.length === 0 && (
                  <span className="text-sm text-muted-foreground italic">No subjects linked</span>
                )}
              </div>
            </div>

            <div className="pt-6 border-t flex gap-4">
              {!isArchived ? (
                <Button 
                  variant="destructive" 
                  onClick={onArchive} 
                  disabled={isPending}
                >
                  <Archive className="h-4 w-4" />
                  Archive Plan
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  onClick={onUnarchive} 
                  disabled={isPending}
                >
                  <ArchiveRestore className="h-4 w-4" />
                  Unarchive Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Grid</CardTitle>
            <CardDescription>Full list of pricing tiers for this plan.</CardDescription>
          </CardHeader>
          <CardContent>
            {plan.pricing_grid.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">No pricing tiers defined.</div>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-2 bg-muted/50 p-3 text-sm font-medium text-muted-foreground border-b">
                  <div>Lessons per month</div>
                  <div className="text-right">Price per lesson</div>
                </div>
                <div className="divide-y">
                  {plan.pricing_grid.map((tier, index) => (
                    <div key={index} className="grid grid-cols-2 p-3 text-sm">
                      <div className="font-medium">{tier.lessons}</div>
                      <div className="text-right">${tier.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}