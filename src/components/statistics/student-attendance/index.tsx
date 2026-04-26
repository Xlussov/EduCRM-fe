'use client';

import { useStudentAttendanceReport } from '@/api/reports/queries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, CheckCircle, XCircle, Percent } from 'lucide-react';
import { formatDate, formatPercent, formatTime } from '@/lib/formatters';

type Props = {
  studentId: string;
  startDate?: string;
  endDate?: string;
  subjectId?: string;
};

export const StudentAttendance = ({ studentId, startDate, endDate, subjectId }: Props) => {
  const { data, isLoading } = useStudentAttendanceReport(studentId, startDate, endDate, subjectId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.total_lessons}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attended</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.summary.attended}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missed</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{data.summary.missed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercent(data.summary.attendance_percentage)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>Detailed log of present and missed classes.</CardDescription>
        </CardHeader>
        <CardContent>
          {!data.items || data.items.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No attendance records found for this period.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {formatDate(item.date)}{' '}
                        <span className="text-muted-foreground ml-2">{formatTime(item.time)}</span>
                      </TableCell>
                      <TableCell>{item.subject_name}</TableCell>
                      <TableCell>
                        <Badge variant={item.is_present ? 'default' : 'destructive'}>
                          {item.is_present ? 'Present' : 'Absent'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.notes || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
