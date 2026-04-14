import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/utils/error-handler';
import { ROUTES } from '@/shared/routes';
import { StudentFormValues } from '@/shared/types';

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: StudentFormValues) => {
      const response = await api.post('/students', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      
      toast.success('Student created successfully');
      router.push(ROUTES.STUDENTS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create student'));
    },
  });
};

export const useUpdateStudent = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: StudentFormValues) => {
      const response = await api.put(`/students/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', id] });
      
      toast.success('Student updated successfully');
      router.push(ROUTES.STUDENTS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update student'));
    },
  });
};

export const useArchiveStudent = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/students/${id}/archive`); 
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', id] });
      
      toast.success('Student archived successfully');
      router.push(ROUTES.STUDENTS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to archive student'));
    },
  });
};

export const useUnarchiveStudent = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/students/${id}/unarchive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', id] });
      
      toast.success('Student unarchived successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to unarchive student'));
    },
  });
};