import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const AuthLayout = () => {
  return (
    <div className="">
      <div className="w-full h-[80px]">
        <Header />
      </div>
      <div className="px-[230px] py-[100px] bg-[#e8edf2] h-[calc(100vh-80px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
