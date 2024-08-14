import { View, Text, Image } from "react-native";
import React, { useLayoutEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const DMScreen = ({ navigation, route }) => {
  selectedContact = route.params.contact;

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

  return (
    <View className="flex-1 items-center">
      <Text>DMScreen</Text>
      <Text>{selectedContact.email}</Text>
    </View>
  );
};

export default DMScreen;
