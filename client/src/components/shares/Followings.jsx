import React from "react";
import { useGetListFollowingsQuery } from "../../redux/features/apis/userApi";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import { Link } from "react-router-dom";
import { Avatar, Typography } from "@material-tailwind/react";

const Followings = () => {
  const { user } = useSelector(authSelect);

  const { data: listFollowingsData } = useGetListFollowingsQuery(
    {
      userId: user?._id,
    },
    { skip: !user?._id }
  );

  return (
    <div className="w-full flex flex-col gap-1 p-4 bg-white rounded-md">
      <Typography className="text-center text-lg text-blue-800 font-bold uppercase">
        Đang theo dõi
      </Typography>
      <div className="flex flex-col gap-4 bg-blue-gray-50 rounded-md p-4">
        {listFollowingsData?.data?.map((following) => {
          return (
            <Link
              to={`/company-profile/${following?._id}`}
              className="flex items-center gap-2"
              key={following?._id}
            >
              <Avatar
                src={following?.companyLogo}
                alt=""
                className="rounded-full bg-blue-gray-200 p-1 h-12 w-12"
              />
              <div className="flex flex-col gap-1">
                <Typography className="text-blue-gray-700 text-sm font-bold hover:text-blue-600 name">
                  {following?.companyName}
                </Typography>
                <Typography className="text-xs text-gray-500 font-semibold name">
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
