import axios from "axios";
import type {
  Category,
  Product,
  Order,
  Promotion,
  DashboardSummary,
  TopProduct,
} from "./types";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1/shop";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

async function get<T>(url: string, params?: Record<string, string>): Promise<T> {
  const res = await api.get<ApiResponse<T>>(url, { params });
  return res.data.data;
}

async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.post<ApiResponse<T>>(url, body);
  return res.data.data;
}

async function put<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.put<ApiResponse<T>>(url, body);
  return res.data.data;
}

async function patch<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.patch<ApiResponse<T>>(url, body);
  return res.data.data;
}

// Categories
export const getCategories = () => get<Category[]>("/categories");
export const createCategory = (data: { name: string; sortOrder?: number }) =>
  post<Category>("/categories", data);
export const updateCategory = (id: number, data: { name: string; sortOrder?: number }) =>
  put<Category>(`/categories/${id}`, data);

// Menu
export const getMenu = () => get<Product[]>("/menu");
export const getMenuItem = (id: number) => get<Product>(`/menu/${id}`);
export const createMenuItem = (data: unknown) => post<Product>("/menu", data);
export const updateMenuItem = (id: number, data: unknown) => put<Product>(`/menu/${id}`, data);
export const toggleMenuItem = (id: number) => patch<Product>(`/menu/${id}/toggle`);
export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post<ApiResponse<{ imageUrl: string }>>("/menu/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data.imageUrl;
};

// Orders
export const getOrders = (params?: Record<string, string>) => get<Order[]>("/orders", params);
export const getOrder = (id: number) => get<Order>(`/orders/${id}`);
export const createOrder = (data: {
  items: { productId: number; optionId: number | null; quantity: number }[];
  couponCode?: string | null;
}) => post<Order>("/orders", data);
export const updateOrderStatus = (id: number, status: string) =>
  patch<Order>(`/orders/${id}/status`, { status });

// Promotions
export const getPromotions = () => get<Promotion[]>("/promotions");
export const createPromotion = (data: unknown) => post<Promotion>("/promotions", data);
export const updatePromotion = (id: number, data: unknown) =>
  put<Promotion>(`/promotions/${id}`, data);
export const togglePromotion = (id: number) => patch<Promotion>(`/promotions/${id}/toggle`);

// Dashboard
export const getDashboardSummary = () => get<DashboardSummary>("/dashboard/summary");
export const getTopProducts = () => get<TopProduct[]>("/dashboard/top-products");
