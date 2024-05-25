import React from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { authSelect } from "../../redux/features/slices/authSlice";
import { images } from "../../assets/images";
import { TypographyCustom } from "../shares";
import { icons } from "../../utils/icons";
import { LineChart } from "../charts";

const Message = ({ sender, message, onClickRecommentQuestion }) => {
  const { user } = useSelector(authSelect);

  return (
    <div
      className={`flex w-full   ${
        user?._id !== message?.senderId?._id || sender === "bot"
          ? "justify-start "
          : "justify-end "
      }`}
    >
      {user?._id !== message?.senderId?._id || sender === "bot" ? (
        <div className="flex gap-1 w-full">
          <Avatar
            src={images.chatbotavatar}
            alt=""
            className="h-10 w-10 bg-blue-gray-700 p-1"
          />
          <div className="flex flex-col gap-1 w-full">
            <div className="group flex items-center gap-1 ">
              <Typography
                className={`whitespace-pre-line text-sm max-w-[80%] font-semibold p-3 rounded-bl-xl rounded-br-xl ${
                  user?._id !== message?.senderId?._id || sender === "bot"
                    ? "bg-white text-blue-gray-800 rounded-tl-sm rounded-tr-xl"
                    : "bg-blue-gray-800 text-white rounded-tr-sm rounded-tl-xl"
                }`}
              >
                {message.message}
              </Typography>
              <span className="hidden group-hover:inline-block text-gray-800 cursor-pointer">
                <icons.HiDotsVertical />
              </span>
            </div>
            <div className="max-w-[80%]">
              {message?.employers && (
                <div className="grid grid-cols-3 gap-1">
                  {message?.employers.map((employer, index) => (
                    <Link
                      key={index}
                      to={`/company-profile/${employer?._id}`}
                      className="text-blue-gray-600 border hover:border-blue-500  hover:bg-blue-50 transition-all flex items-center gap-1 p-2 rounded-md bg-white"
                    >
                      <Avatar
                        src={employer?.companyLogo}
                        alt={employer?.companyName}
                        className="bg-blue-gray-200 p-[2px] !rounded-md"
                      />
                      <div className="flex flex-col ">
                        <TypographyCustom
                          text={employer?.companyName}
                          className="name"
                        />
                        {employer?.applicationsCount && (
                          <TypographyCustom
                            text={`Số lượng: ${employer?.applicationsCount}`}
                            className="name"
                          />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {message?.image && (
                <div className="max-w-[100%] p-2 rounded-md bg-white">
                  <img src={message?.image} alt="" className=" object-cover" />
                </div>
              )}
              {message?.charts?.length > 0 && (
                <div className="flex flex-col gap-1 ">
                  <div className="p-2 rounded-md bg-white">
                    <LineChart data={message?.charts} className="text-black" />
                  </div>
                </div>
              )}
              {message?.jobs && (
                <div className="max-w-[100%] flex flex-col gap-1">
                  {message?.jobs?.map((job) => {
                    return (
                      <Link
                        to={`/job-detail/${job?._id}`}
                        key={job?.recruitmentTitle}
                        className="group cursor-pointer hover:bg-blue-50 border hover:border-blue-500 transition-all flex items-center gap-4 p-2 rounded-md bg-white"
                      >
                        <img
                          src={job?.companyLogo}
                          alt=""
                          className="h-20 w-20 flex-none bg-blue-gray-200 rounded-md border border-blue-gray-200"
                        />
                        <div className="flex flex-col gap-1">
                          <TypographyCustom text={job?.recruitmentTitle} />
                          <div className="flex items-center gap-1">
                            <span className="text-xs px-2 py-1 group group-hover:bg-white bg-red-50 text-red-500 rounded-full">
                              {job?.level}
                            </span>
                            <ul className="flex items-center gap-1 flex-wrap">
                              {job?.skills?.slice(0, 6)?.map((skill, index) => {
                                return (
                                  <li
                                    key={index}
                                    className="text-xs px-2 py-1 group group-hover:bg-white bg-indigo-50 text-indigo-500 rounded-full"
                                  >
                                    {skill}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
              {message?.buttons && (
                <div className="flex flex-col gap-1 justify-items-start mt-1">
                  {message?.buttons.map((buttonItem, index) => (
                    <div key={index}>
                      {buttonItem?.url ? (
                        <Link
                          to={buttonItem?.url}
                          target="_blank"
                          className="inline-flex border hover:border-green-500 items-center gap-2 bg-gray-50 px-4 py-3 rounded-full cursor-pointer text-sm text-green-600 hover:bg-green-50 transition-all"
                        >
                          <span>
                            <icons.IoLinkOutline size={20} />
                          </span>
                          <TypographyCustom
                            text={buttonItem?.url}
                            className="text-xs text-light-green-600 name"
                          />
                        </Link>
                      ) : (
                        <button
                          className="border hover:border-blue-500 flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-full cursor-pointer text-sm text-blue-gray-600 hover:bg-blue-50 transition-all"
                          onClick={() =>
                            onClickRecommentQuestion({
                              message: buttonItem?.title,
                            })
                          }
                        >
                          <span>
                            <icons.IoSendSharp />
                          </span>
                          <TypographyCustom
                            text={buttonItem?.title}
                            className="text-xs text-light-blue-600"
                          />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="group flex items-center gap-1 max-w-[70%]">
          <span className="hidden group-hover:inline-block text-gray-800 cursor-pointer">
            <icons.HiDotsVertical />
          </span>
          <Typography
            className={`whitespace-pre-line text-sm font-semibold p-3 rounded-bl-xl rounded-br-xl ${
              user?._id !== message?.senderId?._id
                ? "bg-gray-100 text-blue-gray-800 rounded-tl-sm rounded-tr-xl"
                : "bg-blue-gray-800 text-white rounded-tr-sm rounded-tl-xl"
            }`}
          >
            {message.message}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Message;
