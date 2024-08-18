import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  logout: () => {},
  userInfo: null,
  setUserInfo: () => {},
  token: null,
  setToken: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState();
  const [token, setToken] = useState();

  const setUserInformation = (userData) => {
    setUserInfo(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUserInfo(null);
  };

  const setTokenInformation = (token) => {
    {
      setToken(token);
    }
  };

  const value = {
    isAuthenticated: !!userInfo,
    logout: logout,
    userInfo: userInfo,
    setUserInfo: setUserInformation,
    token: token,
    setToken: setTokenInformation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
