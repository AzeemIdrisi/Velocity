import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  logout: () => {},
  userInfo: null,
  setUserInfo: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState();

  const setUserInformation = (userData) => {
    setUserInfo(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUserInfo(null);
  };

  const value = {
    isAuthenticated: !!userInfo,
    logout: logout,
    userInfo: userInfo,
    setUserInfo: setUserInformation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
