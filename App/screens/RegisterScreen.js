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
import { UserRegister } from "../utils/auth";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { AuthContext } from "../store/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { extractJWT } from "../utils/tools";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const userCtx = useContext(AuthContext);

  const handleRegister = async () => {
    if (!email || !password || !confirmpassword) {
      Alert.alert("Invalid credentials", "All fields are required.");
      return;
    }
    if (password !== confirmpassword) {
      Alert.alert(
        "Passwords do not match",
        "Please check both the password feilds"
      );
      return;
    }

    // If credentials are there
    try {
      setAuthenticating(true);
      const response = await UserRegister(email, password);
      if (response && response.status === 201) {
        const token = extractJWT(response.headers);
        AsyncStorage.setItem("token", token);
        userCtx.setUserInfo(response.data.user);
      } else {
        setAuthenticating(false);

        Alert.alert("Registration Failed", response.data);
      }
    } catch (error) {
      setAuthenticating(false);
      Alert.alert(
        "Registration Failed",
        "Please check your credentials and try again."
      );
      console.log("Register Screen", { error });
    }
  };

  if (authenticating) {
    return <LoadingOverlay>Signing up</LoadingOverlay>;
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
          value={email.toLowerCase()}
          stateUpdater={setEmail}
        />
        <Input
          title={"Password"}
          placeholder={"Enter your password"}
          value={password}
          stateUpdater={setPassword}
          isPassword={true}
        />
        <Input
          title={"Confirm Password"}
          placeholder={"Re-Enter your password"}
          value={confirmpassword}
          stateUpdater={setConfirmPassword}
          isPassword={true}
        />
        <ButtonX onPress={handleRegister}>Signup</ButtonX>
      </View>
      <View className="flex flex-row m-4 justify-center">
        <Text className="text-center">Already have an account?</Text>
        <Pressable onPress={() => navigation.replace("Login")}>
          <Text className="text-blue-600"> Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
