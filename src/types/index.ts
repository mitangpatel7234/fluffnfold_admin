
export interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  pricePerKg?: number;
  savings?: string;
  popular?: boolean;
  categoryId: number;
  featureIds: number[];
  includeIds?: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  featureIds: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: number;
  customerId: number;
  customerName: string;
  productId?: number;
  serviceId?: number;
  date: string;
  price: number;
  status: 'pending' | 'confirmed' | 'pickuped' | 'delivered';
  createdAt?: string;
}
export interface BookingStatus {
  id: number;
  status: 'pending' | 'confirmed' | 'pickuped' | 'delivered';
  isPaid?: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: string;
  status:boolean
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  featureIds?: number[];
}

export interface Feature {
  id: number;
  name: string;
  description?: string;
}

export interface Include {
  id: number;
  name: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Analytics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  mostSoldProduct?: Product;
  mostSoldService?: Service;
}

export interface CreateProductDto {
  name: string;
  description: string;
  pricePerKg?: number;
  savings?: string;
  popular?: boolean;
  categoryId: number;
  featureIds: number[];
  includeIds?: number[];
}

export interface CreateServiceDto {
  name: string;
  description: string;
  featureIds: number[];
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  featureIds?: number[];
}
