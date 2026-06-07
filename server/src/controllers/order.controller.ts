import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/order.service";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { shippingAddress } = req.body as {
      shippingAddress: {
        name: string;
        address: string;
        city: string;
        country: string;
        postalCode: string;
      };
    };
    const order = await orderService.createOrder(userId, shippingAddress);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const orders = await orderService.getOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const order = await orderService.getOrderById(userId, id);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
