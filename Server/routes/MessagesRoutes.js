import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFiles } from "../controllers/MessagesController.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

const authRoutes = Router();

//Configuring image files upload location
// Configure Multer storage to use Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "files", // Cloudinary folder name
    format: async (req, file) => "jpeg", // supports promises as well
    public_id: (req, file) => Date.now() + file.originalname, // supports promises as well
  },
});

// Initialize Multer with the Cloudinary storage
const upload = multer({ storage: storage });

const messageRoutes = Router();

messageRoutes.post("/get-messages", verifyToken, getMessages);
messageRoutes.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFiles
);

export default messageRoutes;
