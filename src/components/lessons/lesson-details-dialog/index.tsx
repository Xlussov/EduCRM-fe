'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LessonInfo } from '@/shared/types';
import { useCancelLesson } from '@/api/lessons/mutations';
import { Calendar, Clock, BookOpen, User, Users, XCircle, Loader2 } from 'lucide-react';

interface Props {
  lesson: LessonInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LessonDetailsDialog = ({ lesson, isOpen, onClose }: Props) => {
  const { mutate: cancelLesson, isPending } = useCancelLesson();

  if (!lesson) return null;

  const isGroup = !!lesson.group;
  const isCancelled = lesson.status === 'CANCELLED';
  const isCompleted = lesson.status === 'COMPLETED';

  const handleCancel = () => {
    cancelLesson(lesson.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-xl">Lesson Details</DialogTitle>
            <Badge variant={isCancelled ? 'secondary' : isCompleted ? 'default' : 'outline'}>
              {lesson.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 text-sm">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium w-20">Subject:</span>
            <span>{lesson.subject?.name || 'Unknown'}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium w-20">Teacher:</span>
            <span>
              {lesson.teacher?.first_name} {lesson.teacher?.last_name}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {isGroup ? (
              <Users className="h-4 w-4 text-muted-foreground" />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-medium w-20">{isGroup ? 'Group:' : 'Student:'}</span>
            <span>
              {isGroup
                ? lesson.group?.name
                : `${lesson.student?.first_name || ''} ${lesson.student?.last_name || ''}`.trim() ||
                  'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm pt-2 border-t">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium w-20">Date:</span>
            <span>{lesson.date}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium w-20">Time:</span>
            <span>
              {lesson.start_time.slice(0, 5)} - {lesson.end_time.slice(0, 5)}
            </span>
          </div>
        </div>

        {!isCancelled && !isCompleted && (
          <div className="pt-4 flex justify-end border-t">
            <Button variant="destructive" onClick={handleCancel} disabled={isPending}>
              {isPending ? (
                <Loader2 className=" h-4 w-4 animate-spin" />
              ) : (
                <XCircle className=" h-4 w-4" />
              )}
              Cancel Lesson
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
