"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { User } from '@/shared/types';

export const useUser = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get<User>('/auth/me');
      return data;
    },
    staleTime: 1000 * 60 * 5, 
    retry: false,
  });
};