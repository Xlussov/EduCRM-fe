'use client';

import { Button } from '@/components/ui/button';

import { XCircle, Edit, Loader2, CalendarOff, ClipboardCheck, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  lessonId: string;
  isCancelled: boolean;
  isScheduled: boolean;
  hasTemplate: boolean;
  isAdmin: boolean;
  isProcessing: boolean;
  onCancelSingle: () => void;
  onCancelSeries: () => void;
};

export const LessonActions = ({
  lessonId,
  isCancelled,
  isScheduled,
  hasTemplate,
  isAdmin,
  isProcessing,
  onCancelSingle,
  onCancelSeries,
}: Props) => {
  return (
    <div className="pt-6 flex flex-wrap justify-end gap-3 border-t">
      {!isCancelled && (
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/attendance/${lessonId}`}>
            <ClipboardCheck className="h-4 w-4" />
            Mark Attendance
          </Link>
        </Button>
      )}

      {isAdmin && isScheduled && (
        <>
          <Button variant="outline" asChild disabled={isProcessing}>
            <Link href={`/lessons/edit/${lessonId}`}>
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </Button>

          {hasTemplate ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="destructive" disabled={isProcessing}>
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Cancel Options
                  <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onClick={onCancelSingle} className="cursor-pointer">
                  <XCircle className="h-4 w-4" />
                  Cancel Only This
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onCancelSeries}
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <CalendarOff className="h-4 w-4" />
                  Cancel Entire Series
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="destructive" onClick={onCancelSingle} disabled={isProcessing}>
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Cancel Lesson
            </Button>
          )}
        </>
      )}
    </div>
  );
};
