import express from "express";
import protect from "../Middleware/authMiddleware.js";
import upload from "../Middleware/uploadMiddleware.js";
import {
  sendMessage,
  getMessages,
  markMessageSeen,
  getUnreadCount,
  addReaction,   // ✅ FIX: was missing
  editMessage,   // ✅ FIX: was missing
  deleteMessage, // ✅ FIX: was missing
  pinMessage,    // ✅ FIX: was missing
  forwardMessage,// ✅ FIX: was missing
} from "../Controller/messageController.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), sendMessage);

router.get("/unread/count", protect, getUnreadCount); // ✅ FIX: must be BEFORE /:receiverId

router.get("/:receiverId", protect, getMessages);

router.put("/seen", protect, markMessageSeen);

router.put("/reaction", protect, addReaction);   // ✅ FIX: was missing

router.put("/edit", protect, editMessage);        // ✅ FIX: was missing

router.put("/pin", protect, pinMessage);          // ✅ FIX: was missing

router.post("/forward", protect, forwardMessage); // ✅ FIX: was missing

router.delete("/:messageId", protect, deleteMessage);

export default router;