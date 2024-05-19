import { Breadcrumbs } from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";

const ForumPage = () => {
  return (
    <div className="px-[110px] py-[20px] flex flex-col gap-2">
      <Breadcrumbs fullWidth className="bg-white">
        <Link to="/" className="text-light-blue-500 text-sm font-bold">
          Trang chủ
        </Link>
        <Link to="/forum" className="font-bold text-sm">
          Diễn đàn việc làm
        </Link>
      </Breadcrumbs>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">đấ</div>
        <div className="col-span-3">đấ</div>
      </div>
    </div>
  );
};

export default ForumPage;
