export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],

  setSelectedChatType: (newSelectedChatType) =>
    set({ selectedChatType: newSelectedChatType }),

  setSelectedChatData: (newSelectedChatData) =>
    set({ selectedChatData: newSelectedChatData }),

  setSelectedChatMessages: (newSelectedChatMessages) =>
    set({ selectedChatMessages: newSelectedChatMessages }),

  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
});
