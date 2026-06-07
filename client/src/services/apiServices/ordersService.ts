import api from "../api";
import { Product } from "./productsService";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export const createOrder = async (shippingAddress: string): Promise<Order> => {
  const { data } = await api.post<Order>("/orders", { shippingAddress });
  return data;
};

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<Order[]>("/orders");
  return data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const { data } = await api.get<Order>(`/orders/${orderId}`);
  return data;
};
