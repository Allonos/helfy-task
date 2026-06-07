import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
} from "../controllers/cart.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getCart);
router.post("/", addItem);
router.patch("/:itemId", updateItem);
router.delete("/:itemId", removeItem);

export default router;
