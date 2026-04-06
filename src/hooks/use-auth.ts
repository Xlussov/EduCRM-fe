import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiErrorResponse, LoginCredentials } from '@/shared/types';

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

      router.push('/dashboard');
      toast.success('Login successful!');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const backendError = error.response?.data?.error;

      if (backendError) {
        console.log('Error code:', backendError.code);
        console.log('Message:', backendError.message);

        if (backendError.details) {
          console.log('Fields errors:', backendError.details);
        }
      }
      toast.error('Login failed!'); 
    },
  });
};
