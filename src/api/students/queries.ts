import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { Student, StudentDetails } from '@/shared/types';

export const useStudents = (branchId: string | null) => {
  return useQuery({
    queryKey: ['students', 'all', branchId], 
    queryFn: async () => {
      const { data } = await api.get<{ students: Student[] }>('/students', {
        params: { branch_id: branchId }
      });
      return data.students;
    },

    enabled: !!branchId, 
  });
};

export const useActiveStudents = (branchId: string | null) => {
  return useQuery({
    queryKey: ['students', 'active', branchId], 
    queryFn: async () => {
      const { data } = await api.get<{ students: Student[] }>('/students', {
        params: { 
          status: 'ACTIVE',
          branch_id: branchId 
        } 
      });
      return data.students;
    },
    enabled: !!branchId,
  });
};

export const useStudentById = (id: string) => {
  return useQuery({
    queryKey: ['students', id],
    queryFn: async () => {
      const { data } = await api.get<StudentDetails>(`/students/${id}`);
      return data;
    },
    enabled: !!id,
  });
};