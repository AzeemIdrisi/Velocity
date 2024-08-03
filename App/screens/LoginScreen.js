import { View, Text, Pressable } from "react-native";
import React from "react";

const LoginScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>LoginScreen</Text>

      <Pressable onPress={() => navigation.replace("Register")}>
        <Text>SignUp</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;
