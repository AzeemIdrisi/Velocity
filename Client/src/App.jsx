import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store/store";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  console.log({ isAuthenticated });
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};
function App() {
  // As soon as site is loaded check for JWT Token and
  // if it exists send it to the server for it's validity
  // if valid then Log in user directly

  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true); //Start loading

  const getUserInfo = async () => {
    try {
      const response = await apiClient.get(GET_USER_INFO, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserInfo(response.data.user);
      } else {
        setUserInfo(undefined);
      }
    } catch (error) {
      console.log({ error });
      setUserInfo(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // App is in loading state while userInfo is not present and being fetched
    if (!userInfo) {
      console.log("Calling get user info");
      getUserInfo();
    } else {
      //Stop loading if data is present
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/auth" />} />
        <Route
          path="/auth"
          element={
            // if authenticated then go to /chat i.e cannot access /auth
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
