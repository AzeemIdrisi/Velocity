import { useAppStore } from "@/store/store";
import React from "react";

function Profile() {
  const { userInfo } = useAppStore();

  console.log({ userInfo });
  return <div>Profile</div>;
}

export default Profile;
