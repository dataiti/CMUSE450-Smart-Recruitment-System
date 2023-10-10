import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const MessengerLayout = () => {
  return (
    <div className="w-full h-screen flex">
      <div className="w-[100px] h-full bg-[#212f3f]">
        <Sidebar />
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default MessengerLayout;
