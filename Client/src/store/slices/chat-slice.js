export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContact: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],

  setChannels: (channels) => set({ channels }),

  setIsUploading: (isUploading) => set({ isUploading }),

  setIsDownloading: (isDownloading) => set({ isDownloading }),

  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),

  setFileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),

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
  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },
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
