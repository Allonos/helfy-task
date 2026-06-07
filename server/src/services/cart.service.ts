import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export interface CartItemWithProduct {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
    category: string;
  };
}

export const getCart = async (
  userId: string,
): Promise<CartItemWithProduct[]> => {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          imageUrl: true,
          category: true,
        },
      },
    },
  });
};

export const addItem = async (
  userId: string,
  productId: string,
  quantity: number,
): Promise<CartItemWithProduct> => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const existing = await prisma.cartItem.findFirst({
    where: { userId, productId },
  });

  const newQuantity = existing ? existing.quantity + quantity : quantity;

  if (newQuantity > product.stock) {
    throw new AppError("Quantity exceeds available stock", 400);
  }

  let cartItem;
  if (existing) {
    cartItem = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQuantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            imageUrl: true,
            category: true,
          },
        },
      },
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            imageUrl: true,
            category: true,
          },
        },
      },
    });
  }

  return cartItem;
};

export const updateItem = async (
  userId: string,
  itemId: string,
  quantity: number,
): Promise<CartItemWithProduct> => {
  const cartItem = await prisma.cartItem.findFirst({
    where: { id: itemId, userId },
  });

  if (!cartItem) {
    throw new AppError("Cart item not found", 404);
  }

  const product = await prisma.product.findUnique({
    where: { id: cartItem.productId },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (quantity > product.stock) {
    throw new AppError("Quantity exceeds available stock", 400);
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          imageUrl: true,
          category: true,
        },
      },
    },
  });
};

export const removeItem = async (
  userId: string,
  itemId: string,
): Promise<void> => {
  const cartItem = await prisma.cartItem.findFirst({
    where: { id: itemId, userId },
  });

  if (!cartItem) {
    throw new AppError("Cart item not found", 404);
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
};
