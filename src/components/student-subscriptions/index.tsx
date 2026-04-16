'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Calendar, CreditCard } from 'lucide-react';
import { AssignSubscriptionDialog } from '../assign-subscription-dialog';
import { useStudentSubscriptions } from '@/api/subscriptions/queries';

interface Props {
  studentId: string;
  branchId: string;
}

export const StudentSubscriptions = ({ studentId, branchId }: Props) => {
  const { data: subscriptions, isLoading, isError } = useStudentSubscriptions(studentId);

  if (isLoading) return <div className="p-4 text-sm text-muted-foreground">Loading subscriptions...</div>;
  if (isError) return <div className="p-4 text-sm text-destructive">Failed to load subscriptions.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Active Subscriptions</h3>
        <AssignSubscriptionDialog studentId={studentId} branchId={branchId} />
      </div>

      {subscriptions?.length === 0 ? (
        <Card className="bg-muted/20 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-muted-foreground mb-2">No active subscriptions found</div>
            <div className="text-sm text-muted-foreground/70">
              Assign a plan to allow this student to attend classes.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {subscriptions?.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="p-x-4 flex items-start justify-between">
                <div className="space-y-2">
                  <div className="font-semibold text-lg">{sub.plan.name}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="mr-2 h-4 w-4 opacity-70" />
                    {sub.subject.name}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4 opacity-70" />
                    Starts: {new Date(sub.start_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};