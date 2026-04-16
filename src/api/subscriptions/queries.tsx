import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { StudentSubscription } from '@/shared/types';

export const useStudentSubscriptions = (studentId: string) => {
  return useQuery({
    queryKey: ['students', studentId, 'subscriptions'],
    queryFn: async () => {
      const { data } = await api.get<StudentSubscription[]>(`/students/${studentId}/subscriptions`);
      return data;
    },
    enabled: !!studentId,
  });
};