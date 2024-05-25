import React from "react";
import { Header, Footer } from "../components/layouts";
import { Outlet } from "react-router-dom";

const MainLayout = ({ isFooter = true }) => {
  return (
    <div className="flex flex-col">
      <div className="w-full h-[80px] fixed z-50">
        <Header />
      </div>
      <div className="bg-gradient-to-r from-[#cbd5e1] to-[#f1f5f9] min-h-[calc(100vh-80px)] pt-[80px]">
        <Outlet />
      </div>
      {isFooter && (
        <div className="w-full">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
