import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "../components/layouts";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <div className="w-[270px] fixed h-screen flex-none">
        <Sidebar />
      </div>
      <div className="pl-[270px]  flex flex-col w-full">
        <div className="h-[60px] w-[calc(100vw-270px)] fixed z-20">
          <Header />
        </div>
        <div className="min-h-screen w-full bg-[#e8edf2] pt-[60px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
