import React from "react";
import { Header } from "../components";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col">
      <div className="w-full h-[80px]">
        <Header />
      </div>
      <div className="py-4 bg-[#e8edf2]">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
