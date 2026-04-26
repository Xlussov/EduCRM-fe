'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGroupById } from '@/api/groups/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Loader2, Users } from 'lucide-react';
import { StudentLookup } from '@/components/student-lookup';

export const GroupInfo = () => {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const { data: group, isLoading } = useGroupById(groupId);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              group?.name || 'Group Details'
            )}
          </h2>
          <p className="text-muted-foreground">Manage group details and view enrolled students.</p>
        </div>
      </div>

      {!isLoading && group && (
        <div className="space-y-8 mt-4">
          
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrollment</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {group.students?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Active Students</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight">Enrolled Students</h3>
            <div className="bg-background">
              <StudentLookup 
                preloadedStudents={group.students || []} 
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};