import React from "react";
import { SidebarChatbot } from "../components/layouts";
import { Outlet } from "react-router-dom";

const ChatbotLayout = () => {
  return (
    <div className="flex">
      <div className="w-[20%] fixed h-screen flex-none z-10">
        <SidebarChatbot />
      </div>
      <div className="pl-[20%]  flex flex-col w-full ">
        <div className="min-h-screen w-full bg-[#e8edf2]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatbotLayout;
