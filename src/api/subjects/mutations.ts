import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/utils/error-handler';
import { ROUTES } from '@/shared/routes';
import { SubjectFormValues } from '@/components/subject-form';

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SubjectFormValues) => {
      const response = await api.post('/subjects', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Subject created successfully');
      router.push(ROUTES.SUBJECTS);
      return Promise.all([queryClient.invalidateQueries({ queryKey: ['subjects'] })]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create subject'));
    },
  });
};

export const useUpdateSubject = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SubjectFormValues) => {
      const response = await api.put(`/subjects/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Subject updated successfully');
      router.push(ROUTES.SUBJECTS);
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['subjects'] }),
        queryClient.invalidateQueries({ queryKey: ['subjects', id] }),
      ]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update subject'));
    },
  });
};

export const useArchiveSubject = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/subjects/${id}/archive`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Subject archived successfully');
      router.push(ROUTES.SUBJECTS);
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['subjects'] }),
        queryClient.invalidateQueries({ queryKey: ['subjects', id] }),
      ]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to archive subject'));
    },
  });
};

export const useUnarchiveSubject = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/subjects/${id}/unarchive`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Subject unarchived successfully');
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['subjects'] }),
        queryClient.invalidateQueries({ queryKey: ['subjects', id] }),
      ]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to unarchive subject'));
    },
  });
};