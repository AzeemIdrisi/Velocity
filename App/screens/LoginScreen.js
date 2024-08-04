import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useContext, useState } from "react";
import Input from "../components/UI/Input";
import ButtonX from "../components/UI/ButtonX";
import { UserLogin } from "../utils/auth";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { AuthContext } from "../store/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const userCtx = useContext(AuthContext);

  function extractJWT(headers) {
    // Extract the "Set-Cookie" header value, which is an array of cookie strings
    const cookies = headers["set-cookie"];

    // Find the cookie that starts with "jwt="
    const jwtCookie = cookies.find((cookie) => cookie.startsWith("jwt="));

    if (jwtCookie) {
      // Split the cookie string at the '=' character to get the JWT part
      const token = jwtCookie.split(";")[0].split("=")[1];
      console.log("Extracted Token: ", token);
      return token;
    } else {
      console.error("JWT not found in cookies");
      return null;
    }
  }
  const handleLogin = async () => {
    //Cleaning email before submission
    setEmail(() => {
      return email.toString().trim().toLowerCase();
    });

    if (!email || !password) {
      Alert.alert(
        "Invalid credentials",
        "Please enter valid email and password"
      );
      return;
    }

    // If credentials are there
    try {
      setAuthenticating(true);
      const response = await UserLogin(email, password);
      if (response && response.status === 200) {
        const token = extractJWT(response.headers);
        AsyncStorage.setItem("token", token);
        userCtx.setUserInfo(response.data.user);
      } else {
        setAuthenticating(false);

        Alert.alert(
          "Authentication Failed",
          "Please check your credentials and try again."
        );
      }
    } catch (error) {
      setAuthenticating(false);
      Alert.alert(
        "Authentication Failed",
        "Please check your credentials and try again."
      );
      console.log("LoginScreen", { error });
    }
  };

  if (authenticating) {
    return <LoadingOverlay>Logging in</LoadingOverlay>;
  }
  return (
    <KeyboardAvoidingView behavior="position" className="items-center">
      <View className="justify-center items-center mt-32 mb-10">
        <Image
          className="h-[100] w-[100]"
          source={require("../assets/velocity-logo.png")}
        />
        <Text className="text-center font-bold text-3xl">Velocity</Text>
      </View>
      <View>
        <Input
          title={"Email"}
          placeholder={"Enter your email"}
          value={email}
          stateUpdater={setEmail}
        />
        <Input
          title={"Password"}
          placeholder={"Enter your password"}
          value={password}
          stateUpdater={setPassword}
          isPassword={true}
        />
        <ButtonX onPress={handleLogin}>Login</ButtonX>
      </View>
      <View className="flex flex-row m-4 justify-center">
        <Text className="text-center">Don't have an account?</Text>
        <Pressable onPress={() => navigation.replace("Register")}>
          <Text className="text-blue-600"> Signup</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
