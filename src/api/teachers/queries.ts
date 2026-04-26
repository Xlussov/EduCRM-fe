import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { User } from '@/shared/types';

export const useTeachers = (branchId?: string) => {
  return useQuery({
    queryKey: ['teachers', branchId],
    queryFn: async () => {
      const { data } = await api.get<User[]>('/users/teachers', {
        params: branchId ? { branch_id: branchId } : undefined,
      });
      return data;
    },
  });
};

export const useTeacherById = (id: string) => {
  return useQuery({
    queryKey: ['teachers', id],
    queryFn: async () => {
      const { data } = await api.get<User>(`/users/teachers/${id}`);
      return data;
    },
    enabled: !!id,
  });
};