import { request } from '@green-world/utils/api';
import type { PaginatedResponse } from '@green-world/utils/types';

export interface SellerOrderItem {
  _id: string;
  productId: string;
  buyerUserId?: string | null;
  sellerUserId?: string | null;
  productName: string;
  productPrice: string;
  productQuantity: string;
  buyerStatus: 'NONE' | 'SELLER_CONTACTED' | 'DELIVERED';
  buyerName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerCity: string;
  buyerPostalCode: string;
  buyerMessage?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerReadAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getSellerOrders = (params?: Record<string, any>) =>
  request({
    url: '/orders/my-orders',
    method: 'get',
    params
  }) as Promise<PaginatedResponse<SellerOrderItem>>;

export const getBuyerOrders = (params?: Record<string, any>) =>
  request({
    url: '/orders/my-purchases',
    method: 'get',
    params
  }) as Promise<PaginatedResponse<SellerOrderItem>>;

export const getSellerOrdersPendingCount = () =>
  request({
    url: '/orders/pending-count',
    method: 'get'
  }) as Promise<{ pendingCount: number }>;

export const markSellerOrdersRead = () =>
  request({
    url: '/orders/mark-read',
    method: 'post'
  }) as Promise<{ updated: number }>;

export const updateSellerOrderReadStatus = (id: string, read: boolean) =>
  request({
    url: `/orders/${id}/seller-read`,
    method: 'patch',
    data: { read }
  }) as Promise<{ order: SellerOrderItem }>;

export const updateSellerOrderStatus = (
  id: string,
  status: 'NONE' | 'SELLER_CONTACTED' | 'DELIVERED'
) =>
  request({
    url: `/orders/${id}/seller-status`,
    method: 'patch',
    data: { status }
  }) as Promise<{ order: SellerOrderItem }>;

export const updateBuyerOrderStatus = (
  id: string,
  status: 'NONE' | 'SELLER_CONTACTED' | 'DELIVERED'
) =>
  request({
    url: `/orders/${id}/buyer-status`,
    method: 'patch',
    data: { status }
  }) as Promise<{ order: SellerOrderItem }>;
