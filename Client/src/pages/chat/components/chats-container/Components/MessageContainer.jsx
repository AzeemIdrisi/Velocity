import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store/store";
import {
  GET_CHANNEL_MESSAGES_ROUTE,
  GET_MESSAGES_ROUTE,
  HOST,
} from "@/utils/constants";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";

function MessageContainer() {
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    userInfo,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();
  const scrollRef = useRef();
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      const response = await apiClient.post(
        GET_MESSAGES_ROUTE,
        {
          selectedUserID: selectedChatData._id,
        },
        { withCredentials: true }
      );

      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    };
    const getChannelMessages = async () => {
      const response = await apiClient.get(
        `${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,
        { withCredentials: true }
      );

      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      } else {
        getChannelMessages();
      }
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [selectedChatMessages]);

  const downloadFile = async (file) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    try {
      const response = await apiClient.get(`${file}`, {
        responseType: "blob",
        onDownloadProgress: (ProgressEvent) => {
          const { loaded, total } = ProgressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setFileDownloadProgress(percentCompleted);
        },
      });

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", file.split("/").pop());

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      console.log({ error });
    }
  };
  const renderChannelMessage = (message) => {
    const chatStyle =
      message.sender._id === userInfo.id
        ? "bg-[#3B82F6]/20 text-white border-[#3B82F6]/50"
        : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20";
    return (
      <div
        className={`${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${chatStyle} border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}
        {message.sender._id !== userInfo.id && (
          <div className="flex justify-start items-center gap-3 mb-2">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden  ">
              {message.sender.image ? (
                <AvatarImage
                  className="object-cover rounded-full w-full h-full bg-black"
                  src={`${message.sender.image}`}
                  alt="profile"
                />
              ) : (
                <div
                  className={`uppercase h-8 w-8 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                    message.sender.color
                  )}`}
                >
                  {message.sender.firstName
                    ? message.sender.firstName.split("").shift()
                    : message.sender.email.split("").shift()}
                </div>
              )}
            </Avatar>
            <span className="text-sm text-white/60">
              {message.sender.firstName && message.sender.lastName
                ? message.sender.firstName + " " + message.sender.lastName
                : message.sender.email}
            </span>
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${chatStyle} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
                className="cursor-pointer"
              >
                <img src={`${message.fileUrl}`} height="300" width="300" />
              </div>
            ) : (
              <div className="flex justify-center items-center gap-5">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span className="text-white">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  onClick={() => downloadFile(message.fileUrl)}
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transiotion-all duration-300"
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderDmMessage = (message) => {
    const chatStyle =
      message.sender !== selectedChatData._id
        ? "bg-[#3B82F6]/20 text-white border-[#3B82F6]/50"
        : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20";
    return (
      <div
        className={`${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${chatStyle} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${chatStyle} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
                className="cursor-pointer"
              >
                <img src={`${message.fileUrl}`} height="300" width="300" />
              </div>
            ) : (
              <div className="flex justify-center items-center gap-5">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span className="text-white">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  onClick={() => downloadFile(message.fileUrl)}
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transiotion-all duration-300"
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };
  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDmMessage(message)}
          {selectedChatType === "channel" && renderChannelMessage(message)}
        </div>
      );
    });
  };
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img src={`${imageUrl}`} className="h-[80vh] w-full bg-cover" />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              onClick={() => downloadFile(imageUrl)}
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transiotion-all duration-300"
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transiotion-all duration-300"
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageContainer;
