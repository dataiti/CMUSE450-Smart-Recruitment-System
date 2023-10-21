import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <div className="h-[60px] w-full fixed z-20">
        <Header />
      </div>
      <div className="flex w-full">
        <div className="w-[270px] fixed max-h-[calc(100vh-80px)] flex-none pt-[60px]">
          <Sidebar />
        </div>
        <div className="pl-[270px] min-h-screen w-full bg-[#e8edf2] pt-[60px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
