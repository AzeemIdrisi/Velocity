import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store/store";
import { GET_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import React, { useEffect, useRef } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";

function MessageContainer() {
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();
  const scrollRef = useRef();

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
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviou: "smooth" });
    }
  }, [selectedChatMessages]);

  const downloadFile = async (file) => {
    try {
      const response = await apiClient.get(`${HOST}/${file}`, {
        responseType: "blob",
      });

      const urlBlob = window.URL.createObjectURL(new Blocks([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", file.split("/").pop());

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.log({ error });
    }
  };

  const renderDmMessage = (message) => {
    const chatStyle =
      message.sender !== selectedChatData._id
        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
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
              <div className="cursor-pointer">
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height="300"
                  width="300"
                />
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
        </div>
      );
    });
  };
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  );
}

export default MessageContainer;
