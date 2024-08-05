import {
  View,
  Text,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../store/auth-context";
import Input from "../components/UI/Input";
import ButtonX from "../components/UI/ButtonX";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  AddProfileImage,
  RemoveProfileImage,
  UpdateProfile,
} from "../utils/auth";
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

  async function handleDelete() {
    try {
      const response = await RemoveProfileImage(authCtx.token);
      if (response.status === 200) {
        authCtx.setUserInfo({
          ...authCtx.userInfo,
          image: null,
        });
        setImage(null);
        Alert.alert("Profile photo removed");
      } else {
        Alert.alert("Something went wrong", response.data);
        console.log(response.data);
      }
    } catch (error) {
      Alert.alert("Something went wrong", "Could not update your picture.");
      console.log("SetIMage", { error });
    }
  }

  async function handleEdit() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        return;
      } else {
        setImage(result.assets[0].uri);
      }
      const formData = new FormData();
      formData.append("profile-image", {
        uri: result.assets[0].uri,
        type: "image/jpeg", // Ensure this matches the image type
        name: "profile-image.jpg", // Ensure a valid name
      });

      const response = await AddProfileImage(authCtx.token, formData);
      if (response.status === 200 && response.data.image) {
        authCtx.setUserInfo({
          ...authCtx.userInfo,
          image: response.data.image,
        });
        Alert.alert("Profile photo update successfully");
      } else {
        Alert.alert("Something went wrong", response.data);
        setImage(null);
        console.log(response.data);
      }
    } catch (error) {
      Alert.alert("Something went wrong", "Could not update your picture.");
      setImage(null);
      console.log("SetIMage", { error });
    }
  }
  async function handleSubmit() {
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
        {image ? (
          <Image
            className="h-[150] w-[150] rounded-full"
            source={{ uri: image }}
          />
        ) : (
          <View className="h-[150] w-[150] rounded-full items-center justify-center bg-gray-500">
            <Text className="uppercase text-[50px] text-white font-black">
              {firstName
                ? firstName.split("").shift()
                : authCtx.userInfo.email.split("").shift()}
            </Text>
          </View>
        )}
      </View>

      <View className="justify-center items-center">
        {image ? (
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
        ) : (
          <MaterialIcons
            onPress={handleEdit}
            name="add"
            size={32}
            color="gray"
          />
        )}
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
      <View className="flex-row flex-1 justify-center items-center">
        <Image
          className="h-[20] w-[20]"
          source={require("../assets/velocity-logo.png")}
        />
        <Text className="text-center font-bold text-base ml-1">Velocity</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;
