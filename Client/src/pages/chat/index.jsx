import { useAppStore } from "@/store/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatsContainer from "./components/chats-container";

function Chat() {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    //if profile setup is not completed
    if (!userInfo.profileSetup) {
      toast("Complete your Velocity Profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="h-[100vh] flex overflow-hidden text-white">
      <ContactsContainer />
      {/* <EmptyChatContainer /> */}
      {/* <ChatsContainer /> */}
    </div>
  );
}

export default Chat;
