import { request } from '@green-world/utils/api';
import type { PaginatedResponse } from '@green-world/utils/types';

export interface SellerOrderItem {
  _id: string;
  productId: string;
  productName: string;
  productPrice: string;
  productQuantity: string;
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

export const getSellerOrdersUnreadCount = () =>
  request({
    url: '/orders/unread-count',
    method: 'get'
  }) as Promise<{ unreadCount: number }>;

export const markSellerOrdersRead = () =>
  request({
    url: '/orders/mark-read',
    method: 'post'
  }) as Promise<{ updated: number }>;
