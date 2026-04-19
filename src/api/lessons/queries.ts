import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { LessonInfo } from '@/shared/types';

interface FetchLessonsParams {
  fromDate: string;
  toDate: string;
  teacherId?: string;
  studentId?: string;
  groupId?: string;
}

export const useLessons = ({ fromDate, toDate, teacherId, studentId, groupId }: FetchLessonsParams) => {
  return useQuery({
    queryKey: ['lessons', fromDate, toDate, teacherId, studentId, groupId],
    queryFn: async () => {
      const { data } = await api.get<LessonInfo[]>('/lessons', {
        params: { 
          from_date: fromDate,
          to_date: toDate,
          teacher_id: teacherId,
          student_id: studentId,
          group_id: groupId,
        },
      });
      return data; 
    },
    enabled: !!fromDate && !!toDate,
  });
};