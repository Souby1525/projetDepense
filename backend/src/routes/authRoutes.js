import express from "express";
import {
  login,
  me,
  register,
  resendVerificationEmail,
  updateMe,
  verifyEmail
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.put("/me", protect, updateMe);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", protect, resendVerificationEmail);

export default router;
