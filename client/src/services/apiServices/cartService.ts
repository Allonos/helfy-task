import api from "../api";
import { Product } from "./productsService";

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export const getCart = async (): Promise<CartItem[]> => {
  const { data } = await api.get<CartItem[]>("/cart");
  return data;
};

export const addCartItem = async (
  productId: string,
  quantity: number,
): Promise<CartItem> => {
  const { data } = await api.post<CartItem>("/cart", { productId, quantity });
  return data;
};

export const updateCartItem = async (
  itemId: string,
  quantity: number,
): Promise<CartItem> => {
  const { data } = await api.patch<CartItem>(`/cart/${itemId}`, { quantity });
  return data;
};

export const removeCartItem = async (itemId: string): Promise<void> => {
  await api.delete(`/cart/${itemId}`);
};
