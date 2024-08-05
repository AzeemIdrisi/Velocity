import React, { useContext, useEffect, useState } from "react";
import LoginScreen from "../screens/LoginScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import ContactsScreen from "../screens/ContactsScreen";
import { AuthContext } from "../store/auth-context";
import { GetUserInfo } from "../utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ProfileScreen from "../screens/ProfileScreen";

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
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

const StackNavigator = () => {
  const [loading, setLoading] = useState(true);
  const authCtx = useContext(AuthContext);

  async function fetchTokenFromDevice() {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      authCtx.setToken(token);
    }
    return token;
  }

  const fetchUserInfo = async () => {
    setLoading(true);

    try {
      const token = await fetchTokenFromDevice();
      if (token) {
        console.log("Token found on device, Fetching user info using token");
        const response = await GetUserInfo(token);

        console.log("Received response : ", response.data.user);

        if (response.status === 200 && response.data.user) {
          authCtx.setUserInfo(response.data.user);
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
    if (!authCtx.isAuthenticated) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <LoadingOverlay>Authenticating</LoadingOverlay>;
  }
  return authCtx.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />;
};

export default StackNavigator;
