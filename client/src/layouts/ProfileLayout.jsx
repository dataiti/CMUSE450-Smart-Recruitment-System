import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components";
import SidebarProfile from "../components/SidebarProfile";

const ProfileLayout = () => {
  return (
    <div className="flex flex-col">
      <div className="w-full h-[80px] fixed z-50">
        <Header />
      </div>
      <div className="py-4 mt-[80px] bg-[#e8edf2]">
        <div className="grid grid-cols-12 gap-4 px-[160px]">
          <div className="col-span-3">
            <SidebarProfile />
          </div>
          <div className="col-span-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
