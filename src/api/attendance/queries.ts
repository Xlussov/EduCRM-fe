import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { AttendanceRecord  } from '@/shared/types';

export const useLessonAttendance = (lessonId: string) => {
  return useQuery({
    queryKey: ['attendance', lessonId],
    queryFn: async () => {
      const { data } = await api.get<{ attendance: AttendanceRecord[] }>(`/attendance/${lessonId}`);
      return data.attendance;
    },
    enabled: !!lessonId,
  });
};