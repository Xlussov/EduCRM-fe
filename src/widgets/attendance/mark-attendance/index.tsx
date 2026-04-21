'use client';

import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLessonAttendance } from '@/api/attendance/queries';
import { AttendanceForm } from '@/components/attendance-form';

export default function MarkAttendance() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const { data: attendanceData, isLoading } = useLessonAttendance(lessonId);

  const formattedInitialData = attendanceData?.map(record => ({
    student_id: record.student_id,
    first_name: record.first_name,
    last_name: record.last_name,
    is_present: record.is_present,
    notes: record.notes || '',
  })) || [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lesson Attendance</h2>
          <p className="text-muted-foreground">Mark who is present and add notes.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : formattedInitialData.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No students found for this lesson.
          </div>
        ) : (
          <AttendanceForm lessonId={lessonId} initialData={formattedInitialData} />
        )}
      </div>
    </div>
  );
}