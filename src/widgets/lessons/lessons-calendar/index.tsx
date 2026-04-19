'use client';

import { useState, useMemo } from 'react';
import { View } from 'react-big-calendar';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
import { useBranchContext } from '@/providers/branch-provider';
import { useLessons } from '@/api/lessons/queries';
import { LessonInfo } from '@/shared/types';
import { Loader2, Plus } from 'lucide-react';
import { LessonDetailsDialog } from '@/components/lessons/lesson-details-dialog';
import { CalendarView } from '@/components/lessons/calendar-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LessonsCalendar() {
  const { currentBranchId } = useBranchContext();
  const [selectedLesson, setSelectedLesson] = useState<LessonInfo | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('week');

  const dateRange = useMemo(() => {
    let start, end;
    
    if (currentView === 'month') {
      start = startOfWeek(startOfMonth(currentDate));
      end = endOfWeek(endOfMonth(currentDate));
    } else if (currentView === 'week') {
      start = startOfWeek(currentDate);
      end = endOfWeek(currentDate);
    } else {
      start = startOfDay(currentDate);
      end = endOfDay(currentDate);
    }

    return {
      fromDate: format(start, 'yyyy-MM-dd'),
      toDate: format(end, 'yyyy-MM-dd'),
    };
  }, [currentDate, currentView]);

  const { data: lessons, isLoading } = useLessons({
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate,
  });

  if (!currentBranchId) {
    return <div className="p-8 pt-6">Please select a branch first.</div>;
  }

  const handleEventClick = (lesson: LessonInfo) => {
    setSelectedLesson(lesson);
  };

  const handleCloseModal = () => {
    setSelectedLesson(null);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
        <Button asChild>
          <Link href="/lessons/create">
            <Plus className="h-4 w-4" />
            Create new lesson
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[600px] border rounded-xl bg-muted/10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CalendarView 
          lessons={lessons || []} 
          onEventClick={handleEventClick} 
          currentDate={currentDate}
          currentView={currentView}
          onNavigate={setCurrentDate}
          onViewChange={setCurrentView}
        />
      )}

      <LessonDetailsDialog
        lesson={selectedLesson}
        isOpen={!!selectedLesson}
        onClose={handleCloseModal}
      />
    </div>
  );
}