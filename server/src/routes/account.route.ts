import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/account.controller";

const router = Router();

router.use(authMiddleware);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.patch("/password", changePassword);

export default router;
