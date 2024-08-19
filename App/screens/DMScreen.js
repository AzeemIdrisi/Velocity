import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Platform,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "../store/auth-context";
import { GetMessages } from "../utils/auth";
import MessageItem from "../components/UI/MessageItem";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import moment from "moment";
import { SocketContext } from "../context/SocketContext";

const DMScreen = ({ navigation, route }) => {
  selectedContact = route.params.contact;
  // console.log(selectedContact);

  const authCtx = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const userInfo = authCtx.userInfo;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const scrollRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  }, [chatMessages]);

  const handleReceiveMessage = (message) => {
    console.log("New Message Received");

    if (
      message.sender._id === userInfo.id ||
      message.receiver._id === userInfo.id
    ) {
      setChatMessages((prev) => [
        ...prev,
        {
          ...message,
          sender: message.sender._id,
          receiver: message.receiver._id,
        },
      ]);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", handleReceiveMessage);

      // Clean up the listener when the component unmounts
      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [socket]);

  useEffect(() => {
    setLoading(true);
    async function getMessages() {
      try {
        const response = await GetMessages(authCtx.token, selectedContact._id);
        if (response.status === 200 && response.data.messages) {
          setChatMessages(response.data.messages);
        } else {
          console.log({ response });
        }
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollToEnd({ animated: true });
          }
        }, 1000);
        setLoading(false);
      } catch (error) {
        setLoading(false);

        console.log("DMSCREEN", { error });
      }
    }
    getMessages();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <View className="flex-row items-center gap-2">
            <View>
              {selectedContact.image ? (
                <Image
                  className="h-[32] w-[32] rounded-full"
                  source={{ uri: selectedContact.image }}
                />
              ) : (
                <View className="h-[32] w-[32] rounded-full items-center justify-center bg-gray-500">
                  <Text className="uppercase text-[16px] text-white font-bold">
                    {selectedContact.firstName
                      ? selectedContact.firstName.split("").shift()
                      : selectedContact.email.split("").shift()}
                  </Text>
                </View>
              )}
            </View>
            <Text className="font-semibold">
              {selectedContact.firstName
                ? `${selectedContact.firstName} ${selectedContact.lastName}`
                : selectedContact.email}
            </Text>
          </View>
        );
      },
      headerBackVisible: false,
      headerLeft: () => (
        <Ionicons
          name="chevron-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, []);

  let lastDate = null;
  function renderMessage(messageData) {
    const messageDate = moment(messageData.item.timestamp).format("YYYY-MM-DD");
    const showDate = !lastDate || messageDate !== lastDate;
    lastDate = messageDate;
    return (
      <View>
        {showDate && (
          <Text className="text-center text-gray-500 my-2 w-full">
            {moment(messageData.item.timestamp).format("LL")}
          </Text>
        )}
        <MessageItem message={messageData.item} />
      </View>
    );
  }

  function handleSendMessage() {
    if (socket) {
      console.log("sending message");
      if (message.length > 0)
        socket.emit("sendMessage", {
          sender: userInfo.id,
          content: message,
          receiver: selectedContact._id,
          messageType: "text",
          fileUrl: undefined,
        });
      setMessage("");
    }
  }

  if (loading) return <LoadingOverlay>Connecting</LoadingOverlay>;
  return (
    <KeyboardAvoidingView
      behavior="position"
      className="flex-1 items-center justify-end"
      keyboardVerticalOffset={Platform.OS === "ios" ? 75 : 0}
    >
      <FlatList
        className="w-full"
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={(msg) => msg._id}
        extraData={chatMessages}
        windowSize={10}
        ref={scrollRef}
      />
      <View className="flex-row p-4 border-t-2 border-slate-200  py-5 mb-5">
        <TextInput
          className="border-2 border-slate-400 rounded-full flex-1 p-2 mr-2 h-10"
          placeholder="Type your message"
          placeholderTextColor={"gray"}
          value={message}
          onChangeText={setMessage}
        />
        <View className="bg-blue-500 p-2 rounded-full">
          <Ionicons
            onPress={handleSendMessage}
            name="send"
            size={24}
            color="white"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default DMScreen;
