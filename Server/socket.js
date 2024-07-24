import { Server } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const UserSocketMap = new Map();

  io.on("connection", (socket) => {
    const userID = socket.handshake.query.userID;

    if (userID) {
      UserSocketMap.set(userID, socket.id);
      console.log(`User: ${userID} connected with Socket: ${socket.id}`);
    } else {
      console.log("User ID not provided during socket connection");
    }

    socket.on("sendMessage", async (message) => {
      // Getting current socket IDs of the participants
      const senderSocketId = UserSocketMap.get(message.sender);
      const receiverSocketId = UserSocketMap.get(message.receiver);

      // Creating a new message in the database
      const createdMessaage = await Message.create(message);

      const messageData = await Message.findById(createdMessaage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("receiver", "id email firstName lastName image color");

      // Sending data if receiver is onine
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", messageData);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", messageData);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);

      //removing from UserMap
      for (const [storedUserID, storedSocketID] of UserSocketMap.entries()) {
        if (storedSocketID === socket.id) {
          UserSocketMap.delete(storedUserID);
          break;
        }
      }
    });
  });
};

export default setupSocket;
