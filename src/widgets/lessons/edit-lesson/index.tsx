'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { EditLessonForm } from '@/components/lessons/edit-lesson-form';
import { useLessonById } from '@/api/lessons/queries';

export default function EditLesson() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const { data: lesson, isLoading } = useLessonById(lessonId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.push('/lessons')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Lesson</h2>
          <p className="text-muted-foreground">Update lesson details and schedule.</p>
        </div>
      </div>

      <div className="max-w-2xl bg-card border rounded-xl p-6 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !lesson ? (
          <div className="text-center py-10 text-muted-foreground">
            Lesson not found or you don&apos;t have access.
          </div>
        ) : (
          <EditLessonForm 
            lesson={lesson} 
            onSuccess={() => router.push('/lessons')}
            onCancel={() => router.push('/lessons')}
          />
        )}
      </div>
    </div>
  );
}