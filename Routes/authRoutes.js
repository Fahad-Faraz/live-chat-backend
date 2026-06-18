import protect from "../Middleware/authMiddleware.js";
import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} from "../Controller/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", protect, logoutUser);

export default router;