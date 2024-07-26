import { animationDefaultOptions } from "@/lib/utils";
import React from "react";
import Lottie from "react-lottie";

function EmptyChatContainer() {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div className="flex gap-1 items-center mt-10 lg:text-4xl text-3xl text-opacity-80 text-white text-center transition-all duration-300">
        <img className="h-10 w-10 mt-1" src="src/assets/image.png" />
        <h3 className="poppins-medium">
          Dev<span className=" text-blue-500 ">Chat</span>
        </h3>
      </div>
    </div>
  );
}

export default EmptyChatContainer;
