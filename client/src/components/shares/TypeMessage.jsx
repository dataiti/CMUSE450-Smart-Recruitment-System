import React from "react";
import { Typography, Avatar } from "@material-tailwind/react";
import { images } from "../../assets/images";

export const TextMessage = ({ el, employer }) => {
  return (
    <div
      className={`flex w-full ${
        el?.sender === "employer" || el?.sender === "bot"
          ? "justify-start"
          : "justify-end"
      } `}
    >
      {el?.sender === "employer" || el?.sender === "bot" ? (
        <div className="flex gap-3 w-full">
          <Avatar
            src={
              el?.sender === "employer"
                ? employer?.companyLogo
                : images.chatbotavatar
            }
            alt=""
            className={`${
              el?.sender !== "bot"
                ? "h-10 w-10 bg-white p-2"
                : "h-12 w-12 bg-[#212f3f] p-2"
            }`}
          />
          <div
            className={`${
              el?.sender === "employer" || el?.sender === "bot"
                ? "bg-white"
                : "bg-[#212f3f] text-white"
            } px-4 py-3 rounded-xl  max-w-[70%]`}
          >
            <Typography className="text-sm font-bold">{el?.content}</Typography>
          </div>
        </div>
      ) : (
        <div
          className={`${
            el?.sender === "employer" || el?.sender === "bot"
              ? "bg-white"
              : "bg-[#212f3f] text-white"
          } px-4 py-3 rounded-xl max-w-[70%]`}
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
