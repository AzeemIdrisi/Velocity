import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  createChannnel,
  getUsersChannels,
} from "../controllers/ChannelController.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannnel);
channelRoutes.get("/get-user-channels", verifyToken, getUsersChannels);
export default channelRoutes;
