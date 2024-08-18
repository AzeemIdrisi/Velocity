import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

const LoadingOverlay = ({ children }) => {
  return (
    <View className="flex-1 items-center justify-center p-5">
      <Text className="text-xl font-semibold m-4">{children}</Text>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default LoadingOverlay;
