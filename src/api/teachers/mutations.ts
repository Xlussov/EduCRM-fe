import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/utils/error-handler';
import { ROUTES } from '@/shared/routes';
import { TeacherFormValues } from '@/components/teacher-form';

export type UpdateTeacherPayload = Omit<TeacherFormValues, 'password'>;

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: TeacherFormValues) => {
      const response = await api.post('/users/teachers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Teacher created successfully');
      router.push(ROUTES.TEACHERS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create teacher'));
    },
  });
};

export const useUpdateTeacher = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: UpdateTeacherPayload) => {
      const response = await api.put(`/users/teachers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teachers', id] });
      toast.success('Teacher updated successfully');
      router.push(ROUTES.TEACHERS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update teacher'));
    },
  });
};

export const useArchiveTeacher = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/users/teachers/${id}/archive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teachers', id] });
      toast.success('Teacher archived successfully');
      router.push(ROUTES.TEACHERS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to archive teacher'));
    },
  });
};

export const useUnarchiveTeacher = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/users/teachers/${id}/unarchive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teachers', id] });
      toast.success('Teacher unarchived successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to unarchive teacher'));
    },
  });
};