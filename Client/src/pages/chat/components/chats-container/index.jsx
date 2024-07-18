import React from "react";
import ChatHeader from "./Components/ChatHeader";
import MessageContainer from "./Components/MessageContainer";
import MessageBar from "./Components/MessageBar";

function ChatsContainer() {
  return (
    <div className="fixed h-[100vh] top-0 w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
}

export default ChatsContainer;
