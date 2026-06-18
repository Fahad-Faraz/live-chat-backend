import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const isImage =
      file.mimetype.startsWith("image");

    return {
      folder: isImage
        ? "chat-images"
        : "chat-files",

      resource_type: "auto",

      allowed_formats: [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "pdf",
  "doc",
  "docx",
  "zip",
  "xlsx",
  "mp3",
  "wav",
  "ogg",
  "webm",
  "m4a",
],
    };
  },
});

const upload = multer({
  storage,
});

export default upload;