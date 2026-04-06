import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AdminFormValues, TeacherFormValues } from '@/shared/types';
import { ROUTES } from '@/shared/routes';
import { getErrorMessage } from '@/shared/utils/error-handler';

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: AdminFormValues) => {
      const response = await api.post('/users/admins', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Admin created successfully');
      router.push(ROUTES.STAFF);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create admin'));
    },
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: TeacherFormValues) => {
      const response = await api.post('/users/teachers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Teacher created successfully');
      router.push(ROUTES.STAFF);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to create teacher'));
    },
  });
};