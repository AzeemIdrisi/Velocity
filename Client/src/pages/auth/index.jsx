import React, { useState } from "react";
import Victory from "@/assets/victory.svg";
import Background from "../../assets/login2.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/store";
function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };
  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };
  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          {
            email,
            password,
          },
          {
            withCredentials: true, // Required to recieved cookie from server
          }
        );

        // if User exist

        if (response.data.user.id) {
          toast.success("Logged in successfully.");

          // Storing user info in State Management
          setUserInfo(response.data.user);
          //Checking if user has done profile setup
          if (response.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
        console.log(response.data);
      } catch (error) {
        toast.error(error.response.data);
        console.log({ error });
      }
    }
  };

  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          {
            email,
            password,
          },
          {
            withCredentials: true, // Required to recieved cookie from server
          }
        );
        if (response.status === 201) {
          toast.success("Account created successfully");

          // Storing user info in State Management
          setUserInfo(response.data.user);

          // Redirecting user to complete their profile
          navigate("/profile");
        }
      }
    } catch (error) {
      // //if account is not created then
      toast.error(error.response.data);
      console.log({ error });
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <div className="h-[90vh] w-[90vw] shadow-2xl border-white border-2 text-opacity-90 m:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 overflow-auto px-10 ">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col items-center justify-center ">
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold lg:text-5xl">Welcome</h1>
              <img className="h-[100px]" src={Victory} />
            </div>
            <p className="font-medium text-center">
              Get started with the
              <span className="playwrite-dk-uloopet text-sm">
                {" "}
                LightSpeed
              </span>{" "}
              Chat App
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="w-full bg-transparent rounded-none">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-gray-600 text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-gray-600 text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-500 p-3 transition-all duration-300"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex gap-2 mt-5 flex-col" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  className="p-6 rounded-2xl"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Input
                  placeholder="Password"
                  value={password}
                  type="password"
                  className="p-6 rounded-2xl"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex gap-2 flex-col mt-0" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  className="p-6 rounded-2xl"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Input
                  placeholder="Password"
                  value={password}
                  type="password"
                  className="p-6 rounded-2xl"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  type="password"
                  className="p-6 rounded-2xl"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className=" hidden xl:flex items-center justify-center ">
          <img src={Background} className="h-[400px]" />
        </div>
      </div>
    </div>
  );
}

export default Auth;
