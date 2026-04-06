import { isAxiosError } from 'axios';
import { ApiErrorResponse } from '@/shared/types';

export const getErrorMessage = (
  error: unknown,
  fallback = 'An unexpected error occurred'
): string => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.error?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};