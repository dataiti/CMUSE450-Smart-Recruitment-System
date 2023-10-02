import { Breadcrumbs, IconButton, Input } from "@material-tailwind/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { icons } from "../utils/icons";

const CategoriesPage = () => {
  return (
    <div className="h-[4000px] flex flex-col gap-4">
      <div className="px-[160px]">
        <Breadcrumbs fullWidth>
          <Link to="/" className="opacity-60">
            Việc làm
          </Link>
          <Link to="/category">Danh mục việc làm</Link>
        </Breadcrumbs>
      </div>
      <div className="grid grid-cols-12 gap-4 px-[160px] bg-gray-200 py-6 sticky z-10 top-0">
        <div className="col-span-4 border-2 border-gray-300 rounded-md p-1">
          dasdasdsa
        </div>
        <div className="col-span-4 border-2 border-gray-300 rounded-md p-1">
          dasdasdsa
        </div>
        <div className="col-span-4 flex items-center gap-3 border-2 border-gray-300 rounded-md p-1">
          <Input
            className="border-none focus:border-none"
            labelProps={{
              className: "hidden",
            }}
            placeholder="Nhập công việc muốn tìm"
            containerProps={{
              className: "min-w-0",
            }}
          />
          <IconButton>
            <icons.FiSearch size={24} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
