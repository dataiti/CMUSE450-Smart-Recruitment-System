import React from "react";
import { SidebarChatbot } from "../components/layouts";
import { Outlet } from "react-router-dom";

const ChatbotLayout = () => {
  return (
    <div className="flex">
      <div className="w-[250px] fixed h-screen flex-none">
        <SidebarChatbot />
      </div>
      <div className="pl-[250px]  flex flex-col w-full">
        {/* <div className="h-[60px] w-[calc(100vw-270px)] fixed z-20"></div> */}
        <div className="min-h-screen w-full bg-[#e8edf2] ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatbotLayout;
