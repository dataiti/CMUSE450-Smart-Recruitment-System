import React from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import { useSelector } from "react-redux";

import { authSelect } from "../../redux/features/slices/authSlice";
import { images } from "../../assets/images";

const Message = ({ message }) => {
  const { user } = useSelector(authSelect);

  return (
    <div
      className={`flex w-full   ${
        user?._id !== message?.senderId?._id ? "justify-start " : "justify-end "
      }`}
    >
      {user?._id !== message?.senderId?._id ? (
        <div className="flex gap-2 w-full">
          <Avatar
            src={images.chatbotavatar}
            alt=""
            className="bg-[#212f3f] p-2 h-10 w-10"
          />
          <Typography
            className={`whitespace-pre-line text-sm font-bold max-w-[70%] p-3 rounded-bl-xl rounded-br-xl ${
              user?._id !== message?.senderId?._id
                ? "bg-gray-100 text-blue-gray-400 rounded-tl-sm rounded-tr-xl"
                : "bg-blue-gray-800 text-white rounded-tr-sm rounded-tl-xl"
            }`}
          >
            {message.message}
          </Typography>
        </div>
      ) : (
        <Typography
          className={`text-sm font-bold max-w-[70%] p-3 rounded-bl-xl rounded-br-xl ${
            user?._id !== message?.senderId?._id
              ? "bg-gray-100 text-blue-gray-400 rounded-tl-sm rounded-tr-xl"
              : "bg-blue-gray-800 text-white rounded-tr-sm rounded-tl-xl"
          }`}
        >
          {message.message}
        </Typography>
      )}
    </div>
  );
};

export default Message;
