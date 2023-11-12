import React from "react";
import { Header } from "../components";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col">
      <div className="w-full h-[80px] fixed z-50">
        <Header />
      </div>
      <div className=" bg-gradient-to-r from-[#cbd5e1] to-[#fff] min-h-[calc(100vh-80px)] pt-[80px]">
        <Outlet />
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
