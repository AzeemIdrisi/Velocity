import {
  View,
  Text,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import { AuthContext } from "../store/auth-context";
import Input from "../components/UI/Input";
import ButtonX from "../components/UI/ButtonX";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { UpdateProfile } from "../utils/auth";
import LoadingOverlay from "../components/UI/LoadingOverlay";
const ProfileScreen = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const [image, setImage] = useState(authCtx.userInfo.image);
  const [firstName, setFirstName] = useState(authCtx.userInfo.firstName);
  const [lastName, setLastName] = useState(authCtx.userInfo.lastName);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Edit Profile",
      headerRight: () => (
        <MaterialIcons
          onPress={authCtx.logout}
          name="logout"
          size={24}
          color="black"
        />
      ),
    });
  }, []);

  function handleDelete() {}
  function handleEdit() {}
  async function handleSubmit() {
    console.log("Hey");
    if (!firstName || firstName.length === 0) {
      Alert.alert("First Name is Required", "Please fill all the details.");
      return;
    }
    if (!lastName || lastName.length === 0) {
      Alert.alert("Last Name is Required", "Please fill all the details.");
      return;
    }
    setLoading(true);
    try {
      const response = await UpdateProfile(authCtx.token, firstName, lastName);
      if (response.status === 200 && response.data.user) {
        authCtx.setUserInfo(response.data.user);
        Alert.alert("Profile updated successfully");
        navigation.replace("Contacts");
      } else {
        setLoading(false);
        Alert.alert("An error occurred", "Please try again later.");

        console.log(response);
      }
    } catch (error) {
      setLoading(false);
      console.log("ProfileScreen", { error });
    }
  }

  if (loading) return <LoadingOverlay>Updating Profile</LoadingOverlay>;
  return (
    <KeyboardAvoidingView
      behavior="position"
      className="items-center justify-center"
    >
      <View className="items-center justify-center mt-10 mb-5">
        <Image
          className="h-[150] w-[150] rounded-full"
          source={{ uri: image }}
        />
      </View>

      <View className="flex-row w-full items-center justify-center gap-20 mb-5">
        <MaterialIcons
          onPress={handleDelete}
          name="delete-outline"
          size={32}
          color="gray"
        />
        <MaterialIcons
          onPress={handleEdit}
          name="edit"
          size={32}
          color="gray"
        />
      </View>
      <View className="items-center justify-center">
        <Text className="text-lg font-bold">
          {authCtx.userInfo.firstName} {authCtx.userInfo.lastName}
        </Text>
        <Text className="mb-5 text-lg text-gray-500">
          {authCtx.userInfo.email}
        </Text>
      </View>
      <View>
        <Input
          title="First Name"
          placeholder={firstName}
          stateUpdater={setFirstName}
          value={firstName}
        />
        <Input
          title="Last Name"
          placeholder={lastName}
          stateUpdater={setLastName}
          value={lastName}
        />
        <ButtonX onPress={handleSubmit}>Submit</ButtonX>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;
