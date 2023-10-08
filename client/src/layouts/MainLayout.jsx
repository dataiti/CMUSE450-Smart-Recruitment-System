import React from "react";
import { Header } from "../components";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col">
      <div className="w-full h-[80px] fixed z-20">
        <Header />
      </div>
      <div className="bg-[#e8edf2] min-h-[calc(100vh-80px)] pt-[80px]">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
