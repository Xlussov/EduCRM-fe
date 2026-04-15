import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { SubjectInfo } from '@/shared/types';

export const useSubjects = (branchId: string) => {
  return useQuery({
    queryKey: ['subjects', 'all', branchId],
    queryFn: async () => {
      const { data } = await api.get<{ subjects: SubjectInfo[] }>('/subjects', {
        params: { branch_id: branchId },
      });
      return data.subjects;
    },
    enabled: !!branchId,
  });
};

export const useActiveSubjects = (branchId: string) => {
  return useQuery({
    queryKey: ['subjects', 'active', branchId],
    queryFn: async () => {
      const { data } = await api.get<{ subjects: SubjectInfo[] }>('/subjects', {
        params: { branch_id: branchId, status: 'ACTIVE' },
      });
      return data.subjects;
    },
    enabled: !!branchId,
  });
};

export const useSubjectById = (id: string) => {
  return useQuery({
    queryKey: ['subjects', id],
    queryFn: async () => {
      const { data } = await api.get<{ subject: SubjectInfo }>(`/subjects/${id}`);
      return data.subject;
    },
    enabled: !!id,
  });
};