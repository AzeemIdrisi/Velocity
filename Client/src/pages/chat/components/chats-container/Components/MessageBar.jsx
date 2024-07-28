import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store/store";
import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";

function MessageBar() {
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const socket = useSocket();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        receiver: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data) {
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              receiver: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior (e.g., form submission or new line)
      handleSendMessage();
    }
  };

  return (
    <div className="bg-[#1c1d25] h-[10vh] flex justify-center item-center px-8 mb-6 gap-6 ">
      <div className="flex flex-1 bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          onKeyDown={handleKeyDown}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter Message"
          className="flex-1 bg-transparent p-5 rounded-md focus:border-none focus:outline-none"
        />
        <button
          onClick={handleAttachmentClick}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300  transition-all"
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300  transition-all"
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div ref={emojiRef} className="absolute bottom-16 right-0">
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleEmoji}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 rounded-md flex items-center justify-center p-5 hover:bg-blue-600 focus:bg-blue-600 gap-5 focus:border-none focus:outline-none focus:text-white duration-300  transition-all"
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
}

export default MessageBar;
