'use client';

import { useMemo } from 'react';
import { dateFnsLocalizer, Event, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { LessonInfo } from '@/shared/types';
import ShadcnBigCalendar from '@/components/ui/calendar/index';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent extends Event {
  resource: LessonInfo;
}

interface Props {
  lessons: LessonInfo[];
  onEventClick: (lesson: LessonInfo) => void;
  currentDate: Date;
  currentView: View;
  onNavigate: (date: Date) => void;
  onViewChange: (view: View) => void;
}

export const CalendarView = ({
  lessons,
  onEventClick,
  currentDate,
  currentView,
  onNavigate,
  onViewChange,
}: Props) => {
  const events: CalendarEvent[] = useMemo(() => {
    return lessons.map(lesson => {
      const start = new Date(`${lesson.date}T${lesson.start_time}`);
      const end = new Date(`${lesson.date}T${lesson.end_time}`);

      const title = lesson.group
        ? `${lesson.subject?.name} (${lesson.group.name})`
        : `${lesson.subject?.name} - ${lesson.student?.first_name || ''} ${lesson.student?.last_name || ''}`.trim();

      return {
        title,
        start,
        end,
        resource: lesson,
      };
    });
  }, [lessons]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const isGroup = !!event.resource.group;
    const isCancelled = event.resource.status === 'CANCELLED';

    let backgroundColor = isGroup ? '#10b981' : '#3b82f6';
    if (isCancelled) backgroundColor = '#94a3b8';

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: '#fff',
        border: '0px',
        display: 'block',
        padding: '2px 4px',
        fontSize: '12px',
      },
    };
  };

  return (
    <div className="h-[700px] w-full bg-card rounded-xl border shadow-sm p-4">
      <div className="flex gap-4 mb-4 pb-4 border-b">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          Individual
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          Group
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-slate-400"></div>
          Cancelled
        </div>
      </div>

      <ShadcnBigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100% - 60px)' }}
        onSelectEvent={e => onEventClick(e.resource)}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        view={currentView}
        onView={onViewChange}
        date={currentDate}
        onNavigate={onNavigate}
        formats={{
          dayFormat: (date: Date, culture) => localizer.format(date, 'dd EEE', culture as string),

          timeGutterFormat: (date: Date, culture) =>
            localizer.format(date, 'HH:mm', culture as string),

          eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }, culture) =>
            `${localizer.format(start, 'HH:mm', culture as string)} - ${localizer.format(end, 'HH:mm', culture as string)}`,

          selectRangeFormat: ({ start, end }: { start: Date; end: Date }, culture) =>
            `${localizer.format(start, 'HH:mm', culture as string)} - ${localizer.format(end, 'HH:mm', culture as string)}`,

          agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }, culture) =>
            `${localizer.format(start, 'HH:mm', culture as string)} - ${localizer.format(end, 'HH:mm', culture as string)}`,
        }}
      />
    </div>
  );
};
