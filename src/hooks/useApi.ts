
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://api.cleandudsdash.com/v1';

export const useApi = () => {
  const { token, logout } = useAuth();

  const makeRequest = async (url: string, options: RequestInit = {}) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        logout();
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  return { makeRequest };
};
