import { client } from '@green-world/utils/api';
import type { PaginatedResponse } from '@green-world/utils/types';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AdminUserPreview {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller';
  verified: boolean;
  createdAt: string;
}

export interface AdminProductItem {
  _id: string;
  title: string;
  group: string;
  subGroup: string;
  price?: number;
  priceOnRequest?: boolean;
  status: string;
  onStock: boolean;
  editedByAdmin: boolean;
  images: string[];
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
}

export interface AdminServiceItem {
  _id: string;
  title: string;
  status: string;
  editedByAdmin: boolean;
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
}

export interface AdminEventItem {
  _id: string;
  title: string;
  status: string;
  editedByAdmin: boolean;
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
}

export interface AdminBlogBlock {
  _id?: string;
  type: 'text' | 'image' | 'mixed';
  text?: string;
  image?: string;
}

export interface AdminBlogItem {
  _id: string;
  title: string;
  status: string;
  editedByAdmin: boolean;
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
  coverImage?: string;
  author?: string;
  keywords?: string[];
  timeOfReading?: number;
  viewCounter?: number;
  verified?: boolean;
  verifiedDone?: boolean;
  blocks?: AdminBlogBlock[];
}

// ─── Users ──────────────────────────────────────────────────────────────────

export const adminGetUsers = (params?: Record<string, any>) =>
  client
    .get('/admin/users', { params })
    .then((r) => r.data as PaginatedResponse<AdminUserPreview>);

export const adminCreateUser = (data: Record<string, any>) =>
  client
    .post('/admin/users', data)
    .then((r) => r.data.user as AdminUserPreview);

export const adminUpdateUser = (id: string, data: Record<string, any>) =>
  client
    .put(`/admin/users/${id}`, data)
    .then((r) => r.data.user as AdminUserPreview);

export const adminDeleteUser = (id: string) =>
  client.delete(`/admin/users/${id}`).then((r) => r.data);

// ─── Products ───────────────────────────────────────────────────────────────

export const adminGetProducts = (params?: Record<string, any>) =>
  client
    .get('/admin/products', { params })
    .then((r) => r.data as PaginatedResponse<AdminProductItem>);

export const adminGetUsersList = () =>
  client
    .get('/admin/products/users-list')
    .then((r) => r.data.data as AdminUserPreview[]);

export const adminCreateProduct = (data: Record<string, any>) =>
  client
    .post('/admin/products', data)
    .then((r) => r.data.product as AdminProductItem);

export const adminUpdateProduct = (id: string, data: Record<string, any>) =>
  client
    .put(`/admin/products/${id}`, data)
    .then((r) => r.data.product as AdminProductItem);

export const adminDeleteProduct = (id: string) =>
  client.delete(`/admin/products/${id}`).then((r) => r.data);

// ─── Services ───────────────────────────────────────────────────────────────

export const adminGetServices = (params?: Record<string, any>) =>
  client
    .get('/admin/services', { params })
    .then((r) => r.data as PaginatedResponse<AdminServiceItem>);

export const adminCreateService = (data: Record<string, any>) =>
  client
    .post('/admin/services', data)
    .then((r) => r.data.service as AdminServiceItem);

export const adminUpdateService = (id: string, data: Record<string, any>) =>
  client
    .put(`/admin/services/${id}`, data)
    .then((r) => r.data.service as AdminServiceItem);

export const adminDeleteService = (id: string) =>
  client.delete(`/admin/services/${id}`).then((r) => r.data);

// ─── Events ─────────────────────────────────────────────────────────────────

export const adminGetEvents = (params?: Record<string, any>) =>
  client
    .get('/admin/events', { params })
    .then((r) => r.data as PaginatedResponse<AdminEventItem>);

export const adminCreateEvent = (data: Record<string, any>) =>
  client
    .post('/admin/events', data)
    .then((r) => r.data.event as AdminEventItem);

export const adminUpdateEvent = (id: string, data: Record<string, any>) =>
  client
    .put(`/admin/events/${id}`, data)
    .then((r) => r.data.event as AdminEventItem);

export const adminDeleteEvent = (id: string) =>
  client.delete(`/admin/events/${id}`).then((r) => r.data);

// ─── Blogs ──────────────────────────────────────────────────────────────────

export const adminGetBlogs = (params?: Record<string, any>) =>
  client
    .get('/admin/blogs', { params })
    .then((r) => r.data as PaginatedResponse<AdminBlogItem>);

export const adminCreateBlog = (data: Record<string, any>) =>
  client.post('/admin/blogs', data).then((r) => r.data.blog as AdminBlogItem);

export const adminUpdateBlog = (id: string, data: Record<string, any>) =>
  client
    .put(`/admin/blogs/${id}`, data)
    .then((r) => r.data.blog as AdminBlogItem);

export const adminDeleteBlog = (id: string) =>
  client.delete(`/admin/blogs/${id}`).then((r) => r.data);
