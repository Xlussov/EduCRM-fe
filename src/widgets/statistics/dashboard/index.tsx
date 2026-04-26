'use client';

import { useState } from 'react';
import { BranchStatisticsDashboard } from '@/components/statistics/branch-stats';
import { Button } from '@/components/ui/button';
import { useBranchContext } from '@/providers/branch-provider';
import { StudentAttendance } from '@/components/statistics/student-attendance';
import { StudentLookup } from '@/components/student-lookup';

export default function DashboardPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const { currentBranchId } = useBranchContext();

  if (!currentBranchId) {
    return <div className="p-8">Loading...</div>;
  }
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your branch and student statistics.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">Branch Overview</h3>
        <BranchStatisticsDashboard branchId={currentBranchId as string} />
      </div>

      <div className="space-y-4 pt-8 border-t">
        <h3 className="text-xl font-semibold tracking-tight">Student Attendance Lookup</h3>
        <p className="text-sm text-muted-foreground">
          Search and select a student to view their detailed attendance history.
        </p>
        <StudentLookup
          branchId={currentBranchId as string}
          onSelectStudent={setSelectedStudentId}
          selectedStudentId={selectedStudentId}
          actionLabel="View Stats"
        />
      </div>

      {selectedStudentId && (
        <div className="pt-6 border-t animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold tracking-tight">Detailed Statistics</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedStudentId(null)}>
              Close Stats
            </Button>
          </div>
          <StudentAttendance studentId={selectedStudentId} />
        </div>
      )}
    </div>
  );
}
