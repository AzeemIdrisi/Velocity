import {
  View,
  Text,
  Modal,
  Image,
  Alert,
  ScrollView,
  Platform,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AuthContext } from "../store/auth-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Input from "../components/UI/Input";
import { GetContactsForDM, SearchContacts } from "../utils/auth";
import ContactItem from "../components/UI/ContactItem";

const ContactsScreen = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [directMessagesContacts, setDirectMessagesContacts] = useState([]);

  useEffect(() => {
    async function getContacts() {
      console.log("Getting contacts");
      const response = await GetContactsForDM(authCtx.token);
      if (response.status === 200 && response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    }
    getContacts();
  }, []);

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
          onPress={handleLogout}
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

  function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: Platform.OS === "android" && "cancel",
      },
      {
        text: "Yes",
        onPress: () => authCtx.logout(),
      },
    ]);
  }
  function selectContact() {
    setModalVisible(true);
  }

  async function handleSearchContacts(searchTerm) {
    try {
      if (searchTerm.length > 0) {
        const response = await SearchContacts(authCtx.token, searchTerm);
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        } else {
          Alert.alert("Something went wrong", response.data);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log({ error });
    }
  }
  return (
    <View>
      <View className="flex-row items-center justify-between p-4">
        <Text className="uppercase font-semibold text-gray-500 text-base">
          Direct Messages
        </Text>
        <MaterialIcons
          onPress={selectContact}
          name="add"
          size={28}
          color="gray"
        />
      </View>
      {directMessagesContacts.length > 0 &&
        directMessagesContacts.map((contact) => (
          <ContactItem
            key={contact._id}
            contact={contact}
            onPress={() => {
              navigation.navigate("DMScreen", { contact: contact });
              setModalVisible(false);
              setSearchedContacts([]);
            }}
          />
        ))}
      <Modal
        animationType="slide"
        // transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        presentationStyle="formSheet"
      >
        <View>
          <View className="flex-row items-center justify-between p-4">
            <Text className="uppercase font-semibold text-gray-500 text-base">
              Select a contact
            </Text>
            <MaterialIcons
              name="close"
              size={28}
              color="gray"
              onPress={() => setModalVisible(false)}
            />
          </View>
          <View className="justify-center items-center">
            <Input
              placeholder="Search Contacts"
              stateUpdater={handleSearchContacts}
            />
          </View>
          <ScrollView>
            <View className="pb-44">
              {searchedContacts.length == 0 && (
                <View className="justify-center items-center mt-32">
                  <Image
                    className="h-[100] w-[100]"
                    source={require("../assets/velocity-logo.png")}
                  />
                  <Text className="text-center font-bold text-3xl">
                    Velocity
                  </Text>
                </View>
              )}
              {searchedContacts.length > 0 &&
                searchedContacts.map((contact) => (
                  <ContactItem
                    key={contact._id}
                    contact={contact}
                    onPress={() => {
                      navigation.navigate("DMScreen", { contact: contact });
                      setModalVisible(false);
                      setSearchedContacts([]);
                    }}
                  />
                ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ContactsScreen;
