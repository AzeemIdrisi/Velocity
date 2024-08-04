import { View, Text } from "react-native";
import React, { useContext } from "react";
import ButtonX from "../components/UI/ButtonX";
import { AuthContext } from "../store/auth-context";

const ContactsScreen = () => {
  const userCtx = useContext(AuthContext);

  return (
    <View>
      <Text>ContactsScreen</Text>
      <ButtonX onPress={userCtx.logout}>Logout</ButtonX>
    </View>
  );
};

export default ContactsScreen;
