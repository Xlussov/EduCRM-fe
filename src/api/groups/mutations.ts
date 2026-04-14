import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/utils/error-handler';
import { ROUTES } from '@/shared/routes';
import { GroupFormValues } from '@/shared/types';

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: GroupFormValues) => {
      const response = await api.post('/groups', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      
      toast.success('Group created successfully');
      router.push(ROUTES.GROUPS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create group'));
    },
  });
};

export const useUpdateGroup = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: GroupFormValues) => {
      const response = await api.put(`/groups/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups', id] });
      
      toast.success('Group updated successfully');
      router.push(ROUTES.GROUPS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update group'));
    },
  });
};

export const useArchiveGroup = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/groups/${id}/archive`); 
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups', id] });
      
      toast.success('Group archived successfully');
      router.push(ROUTES.GROUPS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to archive group'));
    },
  });
};

export const useUnarchiveGroup = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/groups/${id}/unarchive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups', id] });
      
      toast.success('Group unarchived successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to unarchive group'));
    },
  });
};
export const useSyncGroupStudents = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentIds: string[]) => {
      const response = await api.put(`/groups/${groupId}/students`, { student_ids: studentIds });
      return response.data;
    },
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'students'] }),
        queryClient.invalidateQueries({ queryKey: ['groups', groupId] }),
        queryClient.invalidateQueries({ queryKey: ['groups'] })
      ]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to sync group students'));
    },
  });
};