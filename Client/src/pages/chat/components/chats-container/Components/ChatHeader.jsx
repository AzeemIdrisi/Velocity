import { useAppStore } from "@/store/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  const contact = selectedChatData;
  function handleClose() {
    closeChat();
  }
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 py-8">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative ">
            <Avatar className="h-12 w-12 ">
              {contact.image ? (
                <AvatarImage
                  className="object-cover rounded-full w-full h-full bg-black"
                  src={`${HOST}/${contact.image}`}
                  alt="profile"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                    contact.color
                  )}`}
                >
                  {contact.firstName
                    ? contact.firstName.split("").shift()
                    : contact.email.split("").shift()}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {selectedChatType === "contact" ? (
              <div className="poppins-regular text-lg">
                {contact.firstName && contact.lastName
                  ? contact.firstName + " " + contact.lastName
                  : contact.email}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={handleClose}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300  transition-all"
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
