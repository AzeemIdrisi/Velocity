import { NavigationContainer } from "@react-navigation/native";

import { View, Text } from "react-native";
import React from "react";
import StackNavigator from "./StackNavigator";
import { AuthContextProvider } from "../store/auth-context";

const Navigation = () => {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </AuthContextProvider>
  );
};

export default Navigation;
