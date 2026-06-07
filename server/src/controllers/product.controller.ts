import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { search, category, minPrice, maxPrice, page, limit } =
      req.query as Record<string, string | undefined>;

    const result = await productService.getAll({
      search,
      category,
      minPrice: minPrice !== undefined ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? parseFloat(maxPrice) : undefined,
      page: page !== undefined ? parseInt(page, 10) : undefined,
      limit: limit !== undefined ? parseInt(limit, 10) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getById(id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
