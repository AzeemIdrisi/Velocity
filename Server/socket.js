import { Server } from "socket.io";

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
