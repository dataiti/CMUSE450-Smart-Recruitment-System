import React from "react";
import { Sidebar } from "../components/layouts";
import { Outlet } from "react-router-dom";

const MessengerLayout = () => {
  return (
    <div className="w-full h-screen flex">
      <div className="w-[100px] h-full bg-[#212f3f]">
        <Sidebar />
      </div>
      <div className="w-full bg-gradient-to-r from-[#cbd5e1] to-[#f1f5f9]">
        <Outlet />
      </div>
    </div>
  );
};

export default MessengerLayout;
