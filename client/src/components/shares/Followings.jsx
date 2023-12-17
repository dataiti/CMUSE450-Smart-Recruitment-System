import React from "react";
import { useGetListFollowingsQuery } from "../../redux/features/apis/userApi";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import { Link } from "react-router-dom";
import { Avatar, Typography } from "@material-tailwind/react";

const Followings = () => {
  const { user } = useSelector(authSelect);

  const { data: listFollowingsData } = useGetListFollowingsQuery({
    userId: user?._id,
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <Typography className="text-lg text-blue-500 font-bold">
        Danh sách công ty đang theo dõi
      </Typography>
      <div className="flex flex-col gap-2">
        {listFollowingsData?.data?.map((following) => {
          return (
            <Link
              to={`/company/${following?._id}`}
              className="flex items-center gap-2"
            >
              <Avatar
                src={following?.companyLogo}
                alt=""
                className="rounded-full bg-blue-gray-200 p-2 h-14 w-14"
              />
              <div className="flex flex-col gap-1">
                <Typography className="font-bold">
                  {following?.companyName}
                </Typography>
                <Typography className="text-sm text-gray-500 font-semibold">
                  {following?.websiteUrl}
                </Typography>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Followings;
