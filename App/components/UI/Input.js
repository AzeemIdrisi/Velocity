import { View, Text, TextInput } from "react-native";
import React from "react";

const Input = ({ placeholder, title, isPassword, value, stateUpdater }) => {
  return (
    <View className="mt-2 ">
      {title && (
        <Text className="text-xl font-semibold text-gray-500 ml-5">
          {title}
        </Text>
      )}
      <TextInput
        className=" w-[350] border-2 px-4 py-4 border-gray-400 focus:border-blue-300 rounded-xl my-2"
        placeholder={placeholder}
        secureTextEntry={isPassword}
        value={value}
        onChangeText={(text) => stateUpdater(text)}
        placeholderTextColor="#929292"
        autoCapitalize="none"
        autoCorrect={false}
        allowFontScaling={true}
      />
    </View>
  );
};

export default Input;
