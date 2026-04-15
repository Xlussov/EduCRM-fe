import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { Teacher, } from '@/shared/types';

export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data } = await api.get<Teacher[]>('/users/teachers');
      return data;
    },
  });
};

export const useTeacherById = (id: string) => {
  return useQuery({
    queryKey: ['teachers', id],
    queryFn: async () => {
      const { data } = await api.get<Teacher>(`/users/teachers/${id}`);
      return data;
    },
    enabled: !!id,
  });
};