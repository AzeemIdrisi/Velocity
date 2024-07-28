import { useAppStore } from "@/store/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatsContainer from "./components/chats-container";

function Chat() {
  const {
    userInfo,
    selectedChatType,
    selectedChatData,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
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
      {isUploading && (
        <div className="fixed h-[100vh] w-[100vw] top-0 left-0 z-10 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="fixed h-[100vh] w-[100vw] top-0 left-0 z-10 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {fileDownloadProgress}%
        </div>
      )}
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatsContainer />
      )}
    </div>
  );
}

export default Chat;
