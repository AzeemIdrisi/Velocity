import { View, Text } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import ButtonX from "../components/UI/ButtonX";
import { AuthContext } from "../store/auth-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
    }
  }, [authCtx.userInfo, navigation, isLoading]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Connections",
      headerRight: () => (
        <MaterialIcons
          onPress={authCtx.logout}
          name="logout"
          size={24}
          color="black"
        />
      ),
      headerLeft: () => (
        <MaterialIcons
          onPress={() => navigation.navigate("Profile")}
          name="account-circle"
          size={24}
          color="black"
        />
      ),
    });
  }, []);
  return (
    <View>
      <Text>ContactsScreen</Text>
    </View>
  );
};

export default ContactsScreen;
