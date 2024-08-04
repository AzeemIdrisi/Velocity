import { View, Text } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import LoginScreen from "../screens/LoginScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import ContactsScreen from "../screens/ContactsScreen";
import { AuthContext } from "../store/auth-context";
import { GetUserInfo } from "../utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingOverlay from "../components/UI/LoadingOverlay";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
function AuthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Contacts" component={ContactsScreen} />
    </Stack.Navigator>
  );
}

async function fetchTokenFromDevice() {
  console.log("\n\nfetching...");
  const token = await AsyncStorage.getItem("token");
  return token.toString();
}
const StackNavigator = () => {
  const [loading, setLoading] = useState(true);
  const userCtx = useContext(AuthContext);

  async function fetchTokenFromDevice() {
    const token = await AsyncStorage.getItem("token");
    return token;
  }

  const fetchUserInfo = async () => {
    setLoading(true);

    try {
      const token = await fetchTokenFromDevice();
      if (token) {
        console.log("Fetching user info using token");
        const response = await GetUserInfo(token);

        console.log(
          "Token found on device getting response : ",
          response.data.user
        );

        if (response.status === 200 && response.data.user) {
          userCtx.setUserInfo(response.data.user);
          setLoading(false);
        }
      } else {
        setLoading(false);
        console.log("No token found on device");
      }
    } catch (error) {
      setLoading(false);

      console.log("stack navigator", error);
    }
  };

  //Checking for the first time if device contains token
  useEffect(() => {
    if (!userCtx.isAuthenticated) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [userCtx.setUserInfo, userCtx.userInfo]);

  if (loading) {
    return <LoadingOverlay>Authenticating</LoadingOverlay>;
  }
  return userCtx.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />;
};

export default StackNavigator;
