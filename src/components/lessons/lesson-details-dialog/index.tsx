'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LessonInfo } from '@/shared/types';
import { useCancelLesson, useDeactivateTemplate } from '@/api/lessons/mutations';
import { Calendar, Clock, BookOpen, User, Users } from 'lucide-react';
import { useUser } from '@/api/auth/queries';
import { LessonActions } from './LessonActions';
import Link from 'next/link';

type Props = {
  lesson: LessonInfo | null;
  isOpen: boolean;
  onClose: () => void;
};

export const LessonDetailsDialog = ({ lesson, isOpen, onClose }: Props) => {
  const { mutate: cancelLesson, isPending: isCancelling } = useCancelLesson();
  const { mutate: deactivateTemplate, isPending: isDeactivating } = useDeactivateTemplate();
  const { data: user } = useUser();
  console.log(lesson);
  if (!lesson) return null;

  const isGroup = !!lesson.group;
  const isCancelled = lesson.status === 'CANCELLED';
  const isCompleted = lesson.status === 'COMPLETED';
  const isScheduled = lesson.status === 'SCHEDULED';
  const hasTemplate = !!lesson.template_id;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  const isProcessing = isCancelling || isDeactivating;

  const handleCancelSingle = () => {
    const confirmed = window.confirm('Are you sure you want to cancel this lesson?');
    if (confirmed) {
      cancelLesson(lesson.id, { onSuccess: onClose });
    }
  };

  const handleDeactivateSeries = () => {
    if (!lesson.template_id) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel THIS and ALL FUTURE lessons in this series? This action cannot be undone.',
    );

    if (confirmed) {
      deactivateTemplate(lesson.template_id, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
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
            <span className="font-medium w-24">Subject:</span>
            <span>{lesson.subject?.name || 'Unknown'}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium w-24">Teacher:</span>
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
            <span className="font-medium w-24">{isGroup ? 'Group:' : 'Student:'}</span>

            {isGroup && lesson.group?.id ? (
              <Link
                href={`/groups/${lesson.group.id}`}
                className="hover:underline hover:text-primary transition-colors"
              >
                {lesson.group.name}
              </Link>
            ) : !isGroup && lesson.student?.id ? (
              <Link
                href={`/students/${lesson.student.id}`}
                className="hover:underline hover:text-primary transition-colors"
              >
                {`${lesson.student.first_name || ''} ${lesson.student.last_name || ''}`.trim() ||
                  'N/A'}
              </Link>
            ) : (
              <span>N/A</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm pt-2 border-t">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium w-24">Date:</span>
            <span>{lesson.date}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium w-24">Time:</span>
            <span>
              {lesson.start_time.slice(0, 5)} - {lesson.end_time.slice(0, 5)}
            </span>
          </div>
        </div>

        <LessonActions
          lessonId={lesson.id}
          isCancelled={isCancelled}
          isScheduled={isScheduled}
          hasTemplate={hasTemplate}
          isAdmin={isAdmin}
          isProcessing={isProcessing}
          onCancelSingle={handleCancelSingle}
          onCancelSeries={handleDeactivateSeries}
        />
      </DialogContent>
    </Dialog>
  );
};
