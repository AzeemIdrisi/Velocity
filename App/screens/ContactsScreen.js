import { View, Text } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import ButtonX from "../components/UI/ButtonX";
import { AuthContext } from "../store/auth-context";

const ContactsScreen = ({ navigation }) => {
  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authCtx.userInfo) {
      setIsLoading(false);
    }
  }, [authCtx.userInfo]);

  useLayoutEffect(() => {
    if (!isLoading && authCtx.userInfo && !authCtx.userInfo.profileSetup) {
      console.log("Profile not setup, Going to profile page");
      navigation.replace("Profile");
      console.log("Navigation initiated");
    }
  }, [authCtx.userInfo, navigation, isLoading]);

  return (
    <View>
      <Text>ContactsScreen</Text>
      <ButtonX onPress={authCtx.logout}>Logout</ButtonX>
    </View>
  );
};

export default ContactsScreen;
