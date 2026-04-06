import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { BranchInfo } from '@/shared/types';

export const useBranches = () => {
  return useQuery({
    queryKey: ['branches', 'all'], 
    queryFn: async () => {
      const { data } = await api.get<BranchInfo[]>('/branches');
      return data;
    },
  });
};

export const useActiveBranches = () => {
  return useQuery({
    queryKey: ['branches', 'active'], 
    queryFn: async () => {
      const { data } = await api.get<BranchInfo[]>('/branches', {
        params: { status: 'ACTIVE' } 
      });
      return data;
    },
  });
};

export const useBranchById = (id: string) => {
  return useQuery({
    queryKey: ['branches', id],
    queryFn: async () => {
      const { data } = await api.get<BranchInfo>(`/branches/${id}`);
      return data;
    },
    enabled: !!id,
  });
};