import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/utils/error-handler';
import { ROUTES } from '@/shared/routes';
import { PlanFormValues } from '@/components/plan-form';

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: PlanFormValues) => {
      const response = await api.post('/plans', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Plan created successfully');
      router.push(ROUTES.PLANS);
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['plans', variables.branch_id] }),
      ]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create plan'));
    },
  });
};

export const useArchivePlan = (id: string, branchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/plans/${id}/archive`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Plan archived successfully');
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['plans', branchId] }),
        queryClient.invalidateQueries({ queryKey: ['plans', 'detail', id] }),
      ]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to archive plan'));
    },
  });
};

export const useUnarchivePlan = (id: string, branchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/plans/${id}/unarchive`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Plan unarchived successfully');
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['plans', branchId] }),
        queryClient.invalidateQueries({ queryKey: ['plans', 'detail', id] }),
      ]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to unarchive plan'));
    },
  });
};