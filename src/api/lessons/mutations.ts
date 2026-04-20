import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { toast } from 'sonner';
import { 
  CreateIndividualLessonPayload, 
  CreateGroupLessonPayload, 
  CreateTemplatePayload, 
  UpdateLessonPayload
} from '@/shared/types';
import { getErrorMessage } from '@/shared/utils/error-handler';

export const useCreateIndividualLesson = (branchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIndividualLessonPayload) => {
      const response = await api.post('/lessons/individual', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Individual lesson scheduled successfully');
      return queryClient.invalidateQueries({ queryKey: ['lessons', branchId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to schedule lesson'));
    },
  });
};

export const useCreateGroupLesson = (branchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGroupLessonPayload) => {
      const response = await api.post('/lessons/group', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Group lesson scheduled successfully');
      return queryClient.invalidateQueries({ queryKey: ['lessons', branchId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to schedule group lesson'));
    },
  });
};

export const useCreateLessonTemplate = (branchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTemplatePayload) => {
      const response = await api.post('/lessons/templates', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Template created. ${data.created_lessons_count || ''} lessons scheduled.`);
      if (data.conflicts && data.conflicts.length > 0) {
        toast.warning(`${data.conflicts.length} conflicts detected and skipped.`);
      }
      return queryClient.invalidateQueries({ queryKey: ['lessons', branchId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create lesson template'));
    },
  });
};

export const useCancelLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      const response = await api.patch(`lessons/${lessonId}/cancel`, {});
      return response.data;
    },
    onSuccess: () => {
      toast.success('Lesson cancelled successfully');
      return queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to cancel lesson'));
    },
  });
};

export interface UpdateLessonParams {
  id: string;
  data: UpdateLessonPayload;
}

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateLessonParams) => {
      const response = await api.patch(`/lessons/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Lesson updated successfully');
      return queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update lesson'));
    },
  });
};

export const useDeactivateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string) => {
      const response = await api.patch(`/lessons/templates/${templateId}/deactivate`, {});
      return response.data;
    },
    onSuccess: () => {
      toast.success('Template deactivated. All future lessons are cancelled.');
      return queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to deactivate template'));
    },
  });
};