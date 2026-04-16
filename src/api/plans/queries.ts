import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { PlanInfo } from '@/shared/types';

export const usePlans = (branchId: string) => {
  return useQuery({
    queryKey: ['plans', branchId],
    queryFn: async () => {
      const { data } = await api.get<PlanInfo[]>('/plans', {
        params: { branch_id: branchId },
      });
      return data;
    },
    enabled: !!branchId,
  });
};

export const usePlanById = (id: string) => {
  return useQuery({
    queryKey: ['plans', 'detail', id],
    queryFn: async () => {
      const { data } = await api.get<PlanInfo>(`/plans/${id}`);
      return data;
    },
    enabled: !!id,
  });
};