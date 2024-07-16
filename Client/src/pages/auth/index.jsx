import React, { useState } from "react";
import Victory from "@/assets/victory.svg";
import Background from "../../assets/login2.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {};
  const handleSignup = async () => {};
  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <div className="h-[90vh] w-[90vw] shadow-2xl border-white border-2 text-opacity-90 m:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 overflow-auto ">
        <div className="flex flex-col gap-10 items-center justify-center pl-10">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold lg:text-5xl">Welcome</h1>
              <img className="h-[100px]" src={Victory} />
            </div>
            <p className="font-medium text-center">
              Get started with the 🚀 Velocity Chat App
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4">
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
              <TabsContent className="flex gap-5 mt-10 flex-col" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  className="p-6 rounded-full"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Input
                  placeholder="Password"
                  value={password}
                  type="password"
                  className="p-6 rounded-full"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex gap-5 flex-col" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  className="p-6 rounded-full"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Input
                  placeholder="Password"
                  value={password}
                  type="password"
                  className="p-6 rounded-full"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  type="password"
                  className="p-6 rounded-full"
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
