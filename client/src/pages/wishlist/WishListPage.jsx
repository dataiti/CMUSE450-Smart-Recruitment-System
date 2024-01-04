import React from "react";
import { useSelector } from "react-redux";
import { JobCardSmall } from "../../components/jobs";
import { authSelect } from "../../redux/features/slices/authSlice";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const WishListPage = () => {
  const { user } = useSelector(authSelect);

  return (
    <div className="px-[110px] py-4 flex flex-col gap-2">
      <Breadcrumbs fullWidth className="bg-white">
        <Link to="/" className="text-light-blue-500 text-sm font-bold">
          Trang chủ
        </Link>
        <Link to="/category" className="font-bold text-sm">
          Danh sách các công việc yêu thích
        </Link>
      </Breadcrumbs>
      <div className="grid grid-cols-3 gap-2">
        {user?.wishlistIds?.length > 0 &&
          user?.wishlistIds?.map((jobItem) => {
            return <JobCardSmall jobItem={jobItem} key={jobItem?._id} />;
          })}
      </div>
    </div>
  );
};

export default WishListPage;
