import React from "react";
import Title from "./components/Title";
import ProfileInfo from "./components/ProfileInfo";
import NewDM from "./components/NewDM";
function ContactsContainer() {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="poppins-medium  m-5 text-xl lg:text-2xl text-center flex items-center justify-center">
        <img className="h-7 w-7 mt-1 mr-1" src="src/assets/image.png" />
        <h1>
          In<span className=" text-blue-500 ">finity</span>
        </h1>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}

export default ContactsContainer;
