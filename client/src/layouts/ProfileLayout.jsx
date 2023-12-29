import React from "react";
import { Outlet } from "react-router-dom";
import { Header, SidebarProfile } from "../components/layouts";

const ProfileLayout = () => {
  return (
    <div className="flex flex-col">
      <div className="w-full h-[80px] fixed z-50">
        <Header />
      </div>
      <div className="py-4 mt-[80px] bg-gradient-to-r from-[#cbd5e1] to-[#f1f5f9]">
        <div className="px-[110px] min-h-[calc(100vh-112px)]">
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
