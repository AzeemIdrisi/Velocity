import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  createChannnel,
  getChannelMessages,
  getUsersChannels,
} from "../controllers/ChannelController.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannnel);
channelRoutes.get("/get-user-channels", verifyToken, getUsersChannels);
channelRoutes.get(
  "/get-channel-messages/:channelID",
  verifyToken,
  getChannelMessages
);
export default channelRoutes;
