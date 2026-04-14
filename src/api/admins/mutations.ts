import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/utils/error-handler';
import { ROUTES } from '@/shared/routes';
import { AdminFormValues } from '@/components/admin-form';

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: AdminFormValues) => {
      const response = await api.post('/users/admins', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('Administrator created successfully');
      router.push(ROUTES.ADMINS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create administrator'));
    },
  });
};

export const useUpdateAdmin = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: AdminFormValues) => {
      const response = await api.put(`/users/admins/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admins', id] });
      toast.success('Administrator updated successfully');
      router.push(ROUTES.ADMINS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update administrator'));
    },
  });
};

export const useArchiveAdmin = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/users/admins/${id}/archive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admins', id] });
      toast.success('Administrator archived successfully');
      router.push(ROUTES.ADMINS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to archive administrator'));
    },
  });
};

export const useUnarchiveAdmin = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/users/admins/${id}/unarchive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admins', id] });
      toast.success('Administrator unarchived successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to unarchive administrator'));
    },
  });
};