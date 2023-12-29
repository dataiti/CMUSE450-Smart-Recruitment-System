import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "../components/layouts";

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
        <div className="pl-[270px] min-h-screen w-full bg-gradient-to-r from-[#cbd5e1] to-[#f1f5f9] pt-[60px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
