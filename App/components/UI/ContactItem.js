import { View, Text, Image } from "react-native";
import React from "react";

const ContactItem = ({ contact }) => {
  return (
    <View>
      <View className="flex-row gap-5 items-start m-1">
        <View>
          {contact.image ? (
            <Image
              className="h-[64] w-[64] rounded-full"
              source={{ uri: contact.image }}
            />
          ) : (
            <View className="h-[64] w-[64] rounded-full items-center justify-center bg-gray-500">
              <Text className="uppercase text-[32px] text-white font-bold">
                {contact.firstName
                  ? contact.firstName.split("").shift()
                  : contact.email.split("").shift()}
              </Text>
            </View>
          )}
        </View>
        <View>
          <Text className="font-semibold text-lg">
            {contact.firstName ? contact.firstName : contact.email}{" "}
            {contact.lastName}
          </Text>
          <Text>{contact.email}</Text>
        </View>
      </View>
    </View>
  );
};

export default ContactItem;
