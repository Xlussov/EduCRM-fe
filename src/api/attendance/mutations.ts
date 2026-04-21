import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/utils/error-handler';
import { UpdateAttendancePayload } from '@/shared/types';
import { ROUTES } from '@/shared/routes';
import { useRouter } from 'next/navigation';

export const useMarkAttendance = (lessonId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: UpdateAttendancePayload) => {
      const { data } = await api.put(`/attendance/${lessonId}`, payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Attendance marked successfully');
      router.push(ROUTES.LESSONS)
      return queryClient.invalidateQueries({ queryKey: ['attendance', lessonId] });
    },
    onError: error => {
      toast.error(getErrorMessage(error, 'Failed to mark attendance'));
    },
  });
};
