import { View, Text, TextInput } from "react-native";
import React from "react";

const Input = ({ placeholder, title, isPassword, value, stateUpdater }) => {
  return (
    <View className="mt-2 ">
      <Text className="text-xl font-semibold text-gray-500 ml-5">{title}</Text>
      <TextInput
        className="text-lg w-[350] h-[60px] border-2 px-4 py-2 border-gray-400 focus:border-blue-300 rounded-xl my-2 transition-all duration-300"
        placeholder={placeholder}
        secureTextEntry={isPassword}
        value={value}
        onChangeText={(text) => stateUpdater(text)}
        placeholderTextColor="#929292"
      />
    </View>
  );
};

export default Input;
