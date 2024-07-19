import { useAppStore } from "@/store/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { FiEdit2, FiLogOut } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

function ProfileInfo() {
  const { userInfo, setUserInfo } = useAppStore();

  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success(response.data);
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between w-full px-5 bg-[#2a2b33]">
      <div className="flex items-center justify-center gap-3">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 ">
            {userInfo.image ? (
              <AvatarImage
                className="object-cover rounded-full w-full h-full bg-black"
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="poppins-medium">
          {userInfo.firstName && userInfo.lastName
            ? userInfo.firstName + " " + userInfo.lastName
            : ""}
        </div>
      </div>
      <div className="flex gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                onClick={() => navigate("/profile")}
                className="text-blue-500  font-medium"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <FiLogOut
                onClick={logOut}
                className="text-red-500  font-medium"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Log Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo;
