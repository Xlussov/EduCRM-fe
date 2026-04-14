import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { Group, GroupDetails, Student } from '@/shared/types';

export const useGroups = (branchId: string | null) => {
  return useQuery({
    queryKey: ['groups', 'all', branchId], 
    queryFn: async () => {
      const { data } = await api.get<{ groups: Group[] }>('/groups', {
        params: { branch_id: branchId }
      });
      return data.groups;
    },

    enabled: !!branchId, 
  });
};

export const useActiveGroups = (branchId: string | null) => {
  return useQuery({
    queryKey: ['groups', 'active', branchId], 
    queryFn: async () => {
      const { data } = await api.get<{ groups: Group[] }>('/groups', {
        params: { 
          status: 'ACTIVE',
          branch_id: branchId 
        } 
      });
      return data.groups;
    },
    enabled: !!branchId,
  });
};

export const useGroupById = (id: string) => {
  return useQuery({
    queryKey: ['groups', id],
    queryFn: async () => {
      const { data } = await api.get<GroupDetails>(`/groups/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useGroupStudents = (groupId: string) => {
  return useQuery({
    queryKey: ['groups', groupId, 'students'],
    queryFn: async () => {
      const { data } = await api.get<{ students: Student[] }>(`/groups/${groupId}`);
      return data.students || [];
    },
    enabled: !!groupId,
  });
};