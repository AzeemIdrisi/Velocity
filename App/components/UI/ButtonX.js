import { View, Text, Pressable } from "react-native";
import React from "react";

const ButtonX = ({ children, onPress }) => {
  return (
    <View>
      <Pressable
        onPress={onPress}
        className=" bg-blue-500 rounded-xl py-3 mt-4 active:bg-slate-500 duration-300"
      >
        <Text className="text-center font-bold text-xl text-white">
          {children}
        </Text>
      </Pressable>
    </View>
  );
};

export default ButtonX;
