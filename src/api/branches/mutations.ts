import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BranchFormValues } from '@/components/branch-form';
import Cookies from 'js-cookie';

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: BranchFormValues) => {
      const response = await api.post('/branches', data);

      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        const refreshRes = await api.post('/auth/refresh', { refresh_token: refreshToken });
        Cookies.set('access_token', refreshRes.data.access_token);
        Cookies.set('refresh_token', refreshRes.data.refresh_token);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['me'] }); 
      
      toast.success('Branch created successfully');
      router.push('/branches');
    },
    onError: () => {
      toast.error('Failed to create branch');
    },
  });
};

export const useUpdateBranch = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: BranchFormValues) => {
      const response = await api.put(`/branches/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branches', id] });
      toast.success('Branch updated successfully');
      router.push('/branches');
    },
    onError: () => {
      toast.error('Failed to update branch');
    },
  });
};

export const useArchiveBranch = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/branches/${id}/archive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branches', id] });
      toast.success('Branch archived successfully');
      router.push('/branches');
    },
    onError: () => {
      toast.error('Failed to archive branch');
    },
  });
};