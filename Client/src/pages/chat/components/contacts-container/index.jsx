import React, { useEffect } from "react";
import Title from "./components/Title";
import ProfileInfo from "./components/ProfileInfo";
import NewDM from "./components/NewDM";
import { apiClient } from "@/lib/api-client";
import {
  GET_CONTACTS_FOR_DM_ROUTE,
  GET_USERS_CHANNEL_ROUTE,
} from "@/utils/constants";
import { useAppStore } from "@/store/store";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/CreateChannel";

function ContactsContainer() {
  const {
    setDirectMessagesContact,
    directMessagesContact,
    selectedChatMessages,
    channels,
    setChannels,
  } = useAppStore();

  useEffect(() => {
    const getContactsForDmList = async () => {
      try {
        const response = await apiClient.get(GET_CONTACTS_FOR_DM_ROUTE, {
          withCredentials: true,
        });
        if (response.data.contacts) {
          setDirectMessagesContact(response.data.contacts);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    const getChannels = async () => {
      try {
        const response = await apiClient.get(GET_USERS_CHANNEL_ROUTE, {
          withCredentials: true,
        });
        if (response.data.channels) {
          setChannels(response.data.channels);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    getChannels();
    getContactsForDmList();
  }, [selectedChatMessages]);
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="poppins-medium  m-5 text-xl lg:text-2xl text-center flex items-center justify-center">
        <img
          className="h-7 w-7 mr-1"
          src="../../../src/assets/fast-forward copy.png"
        />
        <h1>Velocity</h1>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContact} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}

export default ContactsContainer;
