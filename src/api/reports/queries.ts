import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { BranchStatistics, StudentAttendanceReport, TeacherStatistics } from '@/shared/types';

export const useBranchStatistics = (branchId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['branch-statistics', branchId, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (branchId) params.append('branch_id', branchId);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const { data } = await api.get<BranchStatistics>(`/reports/branch-statistics?${params.toString()}`);
      return data;
    },
    enabled: !!branchId,
  });
};

export const useStudentAttendanceReport = (studentId: string, startDate?: string, endDate?: string, subjectId?: string) => {
  return useQuery({
    queryKey: ['student-attendance-report', studentId, startDate, endDate, subjectId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (studentId) params.append('student_id', studentId);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (subjectId) params.append('subject_id', subjectId);

      const { data } = await api.get<StudentAttendanceReport>(`/reports/student-attendance?${params.toString()}`);
      return data;
    },
    enabled: !!studentId,
  });
};

export const useTeacherStatistics = (teacherId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['teacher-statistics', teacherId, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (teacherId) params.append('teacher_id', teacherId);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const { data } = await api.get<TeacherStatistics>(`/reports/teacher-statistics?${params.toString()}`);
      return data;
    },
  });
};