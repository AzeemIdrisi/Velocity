export const createAuthSlice = (set) => ({
  userInfo: undefined,
  setUserInfo: (newInfo) => set({ userInfo: newInfo }),
});
