'use client';

import { useParams, useRouter } from 'next/navigation';
import { TeacherStatisticsView } from '@/components/statistics/teacher-stats';
import { useTeacherById } from '@/api/teachers/queries';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useUser } from '@/api/auth/queries';

export default function TeacherStatistics() {
  const params = useParams();
  const router = useRouter();
  
  const urlId = params?.id as string | undefined;
  const isSelfView = !urlId;

  const { data: user } = useUser();
  const targetId = urlId || user?.id;

  const { data: teacher, isLoading } = useTeacherById(urlId as string);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-6">
        {!isSelfView && (
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            {isSelfView ? (
              'My Statistics'
            ) : isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : teacher ? (
              `Statistics of ${teacher.first_name} ${teacher.last_name}`
            ) : (
              'Teacher Statistics'
            )}
          </h2>
          <p className="text-muted-foreground">
            {isSelfView
              ? 'Your personal lesson overview and performance.'
              : "Detailed view of the teacher's scheduled and completed lessons."}
          </p>
        </div>
      </div>

      {targetId && <TeacherStatisticsView teacherId={targetId} />}
    </div>
  );
}