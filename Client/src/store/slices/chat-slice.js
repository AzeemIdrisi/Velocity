export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContact: [],

  setSelectedChatType: (newSelectedChatType) =>
    set({ selectedChatType: newSelectedChatType }),

  setSelectedChatData: (newSelectedChatData) =>
    set({ selectedChatData: newSelectedChatData }),

  setSelectedChatMessages: (newSelectedChatMessages) =>
    set({ selectedChatMessages: newSelectedChatMessages }),

  setDirectMessagesContact: (newDirectMessageContact) =>
    set({ directMessagesContact: newDirectMessageContact }),

  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),

  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          receiver:
            selectedChatType === "channel"
              ? message.receiver
              : message.receiver._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
});
