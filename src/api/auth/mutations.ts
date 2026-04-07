import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginCredentials } from '@/shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { getErrorMessage } from '@/shared/utils/error-handler';
import { ROUTES } from '@/shared/routes';

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    },
    onSuccess: data => {
      Cookies.set('access_token', data.access_token, { path: '/' });
      Cookies.set('refresh_token', data.refresh_token, { path: '/' });

      router.push(ROUTES.ROOT);
      toast.success('Login successful!');
    },
    onError: error => {
      toast.error(
        getErrorMessage(error, 'Login failed. Please check your credentials and try again.'),
      );
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = Cookies.get('refresh_token');

      if (refreshToken) {
        await api.post('/auth/logout', {
          refresh_token: refreshToken,
        });
      }
    },
    onSettled: () => {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      localStorage.removeItem('currentBranchId');
      queryClient.clear();
      router.push(ROUTES.LOGIN);
      toast.success('Logged out successfully!');
    },
  });
};
