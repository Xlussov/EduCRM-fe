import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = Cookies.get('refresh_token');
      
      if (refreshToken) {
        await api.post('/auth/logout', { 
          refresh_token: refreshToken 
        }); 
      }
    },
    onSettled: () => {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      queryClient.clear();
      router.push('/login');
      toast.success('Logged out successfully!');
    }
  });
};