import { View, Text, Pressable } from "react-native";
import React from "react";

const RegisterScreen = ({ navigation }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>RegisterScreen</Text>
      <Pressable onPress={() => navigation.replace("Login")}>
        <Text>Login</Text>
      </Pressable>
    </View>
  );
};

export default RegisterScreen;
