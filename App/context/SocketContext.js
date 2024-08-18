import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../store/auth-context";
import { io } from "socket.io-client";
import { BASE_URL } from "../utils/auth";

export const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const authCtx = useContext(AuthContext);
  const userInfo = authCtx.userInfo;

  const handleReceiveMessage = (message) => {
    const selectedChatMessages = authCtx.selectedChatMessages;
    if (selectedChatMessages !== undefined) {
      console.log("New Message Received");
      authCtx.addMessage({
        ...message,
        sender: message.sender._id,
        receiver: message.receiver._id,
      });
    }
  };
  useEffect(() => {
    if (userInfo) {
      const newSocket = io(BASE_URL, {
        withCredentials: true,
        query: { userID: userInfo.id },
      });
      setSocket(newSocket);
      newSocket.on("connect", () => {
        console.log("Connected to socket server");
      });
      newSocket.on("connect_error", (err) => {
        console.log("Socket connection error:", err);
      });

      newSocket.on("receiveMessage", handleReceiveMessage);
      return () => {
        newSocket.disconnect();
      };
    }
  }, [userInfo]);

  if (!socket) {
    return null; // Or a loading spinner
  }
  //   console.log(socket.current);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
