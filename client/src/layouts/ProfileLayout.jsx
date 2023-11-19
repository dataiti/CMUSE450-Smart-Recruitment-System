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
        <div className="px-[110px]">
          <div className="fixed ">
            <SidebarProfile />
          </div>
          <div className="pl-[20rem] w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
