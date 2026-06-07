import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface OrderItemDetail {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

interface OrderResponse {
  id: string;
  userId: string;
  total: number;
  status: string;
  shippingAddress: ShippingAddress;
  items: OrderItemDetail[];
  createdAt: Date;
}

export const createOrder = async (
  userId: string,
  shippingAddress: ShippingAddress,
): Promise<OrderResponse> => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  for (const item of cartItems) {
    if (item.quantity > item.product.stock) {
      throw new AppError(
        `Insufficient stock for product: ${item.product.name}`,
        400,
      );
    }
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        shippingAddress: shippingAddress as unknown as object,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true },
            },
          },
        },
      },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId } });

    return newOrder;
  });

  return {
    ...order,
    shippingAddress: order.shippingAddress as unknown as ShippingAddress,
  };
};

export const getOrders = async (userId: string): Promise<OrderResponse[]> => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, imageUrl: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    ...order,
    shippingAddress: order.shippingAddress as unknown as ShippingAddress,
  }));
};

export const getOrderById = async (
  userId: string,
  orderId: string,
): Promise<OrderResponse> => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, imageUrl: true },
          },
        },
      },
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return {
    ...order,
    shippingAddress: order.shippingAddress as unknown as ShippingAddress,
  };
};
