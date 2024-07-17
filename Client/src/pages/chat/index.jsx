import { useAppStore } from "@/store/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

  return <div>Chat</div>;
}

export default Chat;
