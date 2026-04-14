import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { Admin } from '@/shared/types';

export const useAdmins = () => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const { data } = await api.get<Admin[]>('/users/admins');
      return data;
    },
  });
};

export const useAdminById = (id: string) => {
  return useQuery({
    queryKey: ['admins', id],
    queryFn: async () => {
      const { data } = await api.get<Admin>(`/users/admins/${id}`);
      return data;
    },
    enabled: !!id,
  });
};