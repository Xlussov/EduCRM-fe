import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { toast } from 'sonner';
import { AssignSubscriptionValues } from '@/shared/types';
import { getErrorMessage } from '@/shared/utils/error-handler';

export const useAssignSubscription = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AssignSubscriptionValues) => {
      const payload = {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
      };
      const response = await api.post(`/students/${studentId}/subscriptions`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Subscription assigned successfully');
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['students', studentId, 'subscriptions'] }),
      ]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to assign subscription'));
    },
  });
};