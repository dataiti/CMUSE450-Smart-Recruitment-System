import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";
import { Followings } from "../../components/shares";

const BlogPage = () => {
  return (
    <div className="py-4 px-[110px] flex flex-col gap-2">
      <Breadcrumbs fullWidth className="bg-white">
        <Link to="/" className="text-light-blue-500 text-sm font-bold">
          Trang chủ
        </Link>
        <Link to="/blog" className="font-bold text-sm">
          Diễn đàn
        </Link>
      </Breadcrumbs>
      <div className="w-full flex gap-4">
        <div className="w-[70%]"></div>
        <div className="w-[30%] p-5 flex flex-col gap-4">
          <Followings />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
