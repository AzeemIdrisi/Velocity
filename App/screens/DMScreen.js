import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "../store/auth-context";
import { GetMessages } from "../utils/auth";
import MessageItem from "../components/UI/MessageItem";
import LoadingOverlay from "../components/UI/LoadingOverlay";

const DMScreen = ({ navigation, route }) => {
  selectedContact = route.params.contact;
  // console.log(selectedContact);

  const authCtx = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);

  useLayoutEffect(() => {
    setLoading(true);
    async function getMessages() {
      try {
        const response = await GetMessages(authCtx.token, selectedContact._id);
        if (response.status === 200 && response.data.messages) {
          setChatMessages(response.data.messages);
        } else {
          console.log({ response });
        }
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

  function renderMessage(messageData) {
    return <MessageItem message={messageData.item} />;
  }

  if (loading) return <LoadingOverlay>Connecting</LoadingOverlay>;
  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 items-center justify-end"
      keyboardVerticalOffset={75}
    >
      <FlatList
        className="w-full"
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={(msg) => msg._id}
      />

      <View className="flex-row p-4 border-t-2 border-slate-200  py-5 mb-5">
        <TextInput
          className="border-2 border-slate-400 rounded-full flex-1 p-2 mr-2 h-10"
          placeholder="Type your message"
          placeholderTextColor={"gray"}
        />
        <View className="bg-blue-500 p-2 rounded-full">
          <Ionicons name="send" size={24} color="white" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default DMScreen;
