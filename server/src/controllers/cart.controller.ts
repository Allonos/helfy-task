import { Request, Response, NextFunction } from "express";
import * as cartService from "../services/cart.service";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const cart = await cartService.getCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const addItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { productId, quantity } = req.body as {
      productId: string;
      quantity: number;
    };
    const item = await cartService.addItem(userId, productId, quantity);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { itemId } = req.params;
    const { quantity } = req.body as { quantity: number };
    const item = await cartService.updateItem(userId, itemId, quantity);
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { itemId } = req.params;
    await cartService.removeItem(userId, itemId);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    next(error);
  }
};
