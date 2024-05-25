import { Avatar, Typography } from "@material-tailwind/react";
import React from "react";

import { CarouselCustom } from "../shares";
import { icons } from "../../utils/icons";

const PostCard = ({ post = {} }) => {
  return (
    <div className="flex flex-col gap-4 bg-white py-4 px-10 rounded-md">
      <div className="flex items-center gap-3">
        <Avatar src={post?.userId?.avatar} alt="" className="h-10 w-10" />
        <div className="flex flex-col">
          <Typography className="text-sm text-blue-gray-700 font-bold">
            {post?.userId?.firstName} {post?.userId?.lastName}
          </Typography>
          <Typography className="italic text-xs text-gray-500 font-semibold">
            {post?.userId?.email}
          </Typography>
        </div>
      </div>
      <Typography className="whitespace-pre-line text-sm font-semibold text-gray-700">
        {post?.content}
      </Typography>
      {post?.images?.length > 0 && (
        <div className="h-full w-full rounded-md border border-blue-gray-200">
          <CarouselCustom images={post?.images} />
        </div>
      )}
      <div className="h-[2px] rounded-full bg-blue-gray-100"></div>
      <div className="flex items-center gap-2">
        <button className="text-blue-gray-700 hover:text-blue-gray-800">
          <icons.IoMdHeartEmpty size={28} />
        </button>
        <button className="text-blue-gray-700 hover:text-blue-gray-800">
          <icons.AiOutlineComment size={28} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
