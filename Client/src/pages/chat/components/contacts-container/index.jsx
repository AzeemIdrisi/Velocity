import React from "react";
import Title from "./Title";
function ContactsContainer() {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="playwrite-dk-uloopet  m-5 text-xl lg:text-2xl text-center flex items-center justify-center">
        <img className="h-7 w-7 mt-1 mr-1" src="src/assets/image.png" />
        <h1>
          <span className=" text-yellow-500 ">Light</span>Speed
        </h1>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
        </div>
      </div>
    </div>
  );
}

export default ContactsContainer;
