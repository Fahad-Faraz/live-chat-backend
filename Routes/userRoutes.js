import express from "express";
import protect from "../Middleware/authMiddleware.js";
import upload from "../Middleware/uploadMiddleware.js";
import {
  getUsers,
  updateAvatar,
  updateProfile,   // ✅ FIX: was missing
  changePassword,  // ✅ FIX: was missing
  logoutAll,       // ✅ FIX: was missing
  blockUser,       // ✅ FIX: was missing
  unblockUser,     // ✅ FIX: was missing
} from "../Controller/userController.js";

const router = express.Router();

router.get("/", protect, getUsers);

router.put("/avatar", protect, upload.single("file"), updateAvatar);

router.put("/profile", protect, updateProfile);

router.put("/password", protect, changePassword);

router.post("/logout-all", protect, logoutAll);

router.put("/block", protect, blockUser);

router.put("/unblock", protect, unblockUser);

export default router;