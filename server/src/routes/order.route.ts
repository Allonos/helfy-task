import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createOrder,
  getOrders,
  getOrderById,
} from "../controllers/order.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);

export default router;
