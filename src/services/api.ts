
import { useApi } from '@/hooks/useApi';
import { 
  Product, 
  Service, 
  Booking, 
  Customer, 
  Category, 
  Feature, 
  Include,
  PaginatedResponse,
  CreateProductDto,
  CreateServiceDto,
  CreateCategoryDto,
  Analytics,
  User,
  BookingStatus
} from '@/types';

export const useApiService = () => {
  const { makeRequest } = useApi();

  // Product API
  const productApi = {
    getAll: (page = 1, limit = 10) => 
      makeRequest(`/products?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<Product>>,
    
    getById: (id: number) => 
      makeRequest(`/products/${id}`) as Promise<Product>,
    
    create: (data: CreateProductDto) => 
      makeRequest('/products', {
        method: 'POST',
        body: JSON.stringify(data)
      }) as Promise<Product>,
    
    update: (id: number, data: Partial<CreateProductDto>) => 
      makeRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }) as Promise<Product>,
    
    delete: (id: number) => 
      makeRequest(`/products/${id}`, { method: 'DELETE' })
  };

  // Service API
  const serviceApi = {
    getAll: (page = 1, limit = 10) => 
      makeRequest(`/service?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<Service>>,
    
    getById: (id: number) => 
      makeRequest(`/service/${id}`) as Promise<Service>,
    
    create: (data: CreateServiceDto) => 
      makeRequest('/service', {
        method: 'POST',
        body: JSON.stringify(data)
      }) as Promise<Service>,
    
    update: (id: number, data: Partial<CreateServiceDto>) => 
      makeRequest(`/service/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }) as Promise<Service>,
    
    delete: (id: number) => 
      makeRequest(`/service/${id}`, { method: 'DELETE' })
  };

  // Category API
  const categoryApi = {
    getAll: (page = 1, limit = 10) => 
      makeRequest(`/categories?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<Category>>,
    
    getAllSimple: () => 
      makeRequest('/categories') as Promise<any>,
    
    getById: (id: number) => 
      makeRequest(`/categories/${id}`) as Promise<Category>,
    
    create: (data: CreateCategoryDto) => 
      makeRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(data)
      }) as Promise<Category>,
    
    update: (id: number, data: Partial<CreateCategoryDto>) => 
      makeRequest(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }) as Promise<Category>,
    
    delete: (id: number) => 
      makeRequest(`/categories/${id}`, { method: 'DELETE' })
  };

  // Booking API
  const bookingApi = {
    getAll: (page = 1, limit = 10) => 
      makeRequest(`/bookings?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<any>>,
    
    

    updateStatus: (id: number, data: Partial<BookingStatus>) =>
      makeRequest(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as Promise<BookingStatus>
  };

  // Customer API
  const customerApi = {
    getAll: (page = 1, limit = 10) => 
      makeRequest(`/auth/users?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<Customer>>,
    
    getById: (id: number) => 
      makeRequest(`/auth/users/${id}`) as Promise<Customer>
  };

  // Features API
  const featureApi = {
    getAll: () => makeRequest('/features') as Promise<Feature[]>
  };

  // Includes API
  const includeApi = {
    getAll: () => makeRequest('/includes') as Promise<Include[]>
  };

  // Analytics API
   // use your configured request service

   const analyticsApi = {
    getDashboard: (filters: {
      year?: number;
      month?: number;
      startDate?: string;
      endDate?: string;
    }) => {
      const queryParams = new URLSearchParams({
        ...(filters.year ? { year: filters.year.toString() } : {}),
        ...(filters.month ? { month: filters.month.toString() } : {}),
        ...(filters.startDate ? { startDate: filters.startDate } : {}),
        ...(filters.endDate ? { endDate: filters.endDate } : {}),
      }).toString();
  
      const url = `/auth/analytics?${queryParams}`;
  
      return makeRequest(url, {
        method: 'GET',
      }) as Promise<{
        totalRevenue: number;
        averageOrderValue: number;
        bestSeller: { name: string; totalSold: number } | null;
        timeline: { label: string; revenue: number }[];
        productSales: { name: string; totalSold: number }[];
      }>;
    },
  };
  

  

  // Profile API
  const profileApi = {
    getMe: () => makeRequest('/auth/me') as Promise<User>,
    
    updateMe: (data: Partial<User>) => 
      makeRequest('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(data)
      }) as Promise<User>
  };

  return {
    productApi,
    serviceApi,
    categoryApi,
    bookingApi,
    customerApi,
    featureApi,
    includeApi,
    analyticsApi,
    profileApi
  };
};
