'use client';

import { useTeacherStatistics } from '@/api/reports/queries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface TeacherStatsProps {
  teacherId?: string;
  startDate?: string;
  endDate?: string;
}

export const TeacherStatisticsView = ({ teacherId, startDate, endDate }: TeacherStatsProps) => {
  const { data, isLoading } = useTeacherStatistics(teacherId, startDate, endDate);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const chartData = [
    { name: 'Completed', value: data.completed_lessons, fill: 'var(--color-completed)' },
    { name: 'Scheduled', value: data.scheduled_lessons, fill: 'var(--color-scheduled)' },
    { name: 'Cancelled', value: data.cancelled_lessons, fill: 'var(--color-cancelled)' },
  ];

  const chartConfig = {
    completed: { label: 'Completed', color: 'var(--primary)' },
    scheduled: { label: 'Scheduled', color: 'var(--muted-foreground)' },
    cancelled: { label: 'Cancelled', color: 'var(--destructive)' },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.scheduled_lessons}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{data.completed_lessons}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cancelled Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{data.cancelled_lessons}</div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Lesson Overview</CardTitle>
          <CardDescription>Breakdown of lesson statuses for the selected period.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
