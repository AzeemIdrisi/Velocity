import { View, Text } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../store/auth-context";

const MessageItem = ({ message }) => {
  const authCtx = useContext(AuthContext);
  const isSender = message.sender === authCtx.userInfo.id;
  return (
    <View
      className={`flex-row ${isSender ? "justify-end" : "justify-start"} m-1`}
    >
      <View
        className={`${
          isSender ? "bg-blue-500" : "bg-slate-300"
        } rounded-3xl py-3 px-4 m-1 max-w-[75%]`}
      >
        <Text
          className={`${isSender ? "text-white" : ""}  leading-5 text-[16px]`}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
};

export default MessageItem;
