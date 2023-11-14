import React from "react";
import { Avatar, Typography } from "@material-tailwind/react";

export const TextMessage = ({ el, user }) => {
  return (
    <div
      className={`flex ${
        el?.sender === "user" ? "justify-start" : "justify-end"
      } `}
    >
      {el?.sender === "user" ? (
        <div className="flex gap-3">
          <Avatar src={user?.avatar} alt="" className="h-10 w-10" />
          <div
            className={`${
              el?.sender === "user" ? "bg-white" : "bg-[#212f3f] text-white"
            } px-4 py-3 rounded-xl max-w-[350px]`}
          >
            <Typography className="text-sm font-bold">{el?.content}</Typography>
          </div>
        </div>
      ) : (
        <div
          className={`${
            el?.sender === "user" ? "bg-white" : "bg-[#212f3f] text-white"
          } px-4 py-3 rounded-xl max-w-[400px]`}
        >
          <Typography className="text-sm font-bold">{el?.content}</Typography>
        </div>
      )}
    </div>
  );
};

export const ReplyMessage = ({ el }) => {
  return (
    <div className={`flex ${el.incoming ? "justify-start" : "justify-end"} `}>
      <div className="flex flex-col gap-2"></div>
    </div>
  );
};

export const MediaMessage = ({ el }) => {
  return (
    <div className={`flex ${el.incoming ? "justify-start" : "justify-end"} `}>
      {/* <div>
        <Typography>{el.message}</Typography>
      </div> */}
    </div>
  );
};
