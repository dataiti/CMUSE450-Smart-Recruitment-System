import React from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { authSelect } from "../../redux/features/slices/authSlice";
import { images } from "../../assets/images";
import { icons } from "../../utils/icons";
import { TypographyCustom } from "../shares";
import { Link } from "react-router-dom";
import LineChart from "../charts/LineChart";

const Message = ({ sender, message, onClickRecommentQuestion }) => {
  const { user } = useSelector(authSelect);

  return (
    <div
      className={`flex w-full  ${
        user?._id !== message?.senderId?._id ? "justify-start " : "justify-end"
      }`}
    >
      {user?._id !== message?.senderId?._id ? (
        <div className="flex gap-2 w-full">
          <Avatar
            src={
              message?.senderId === "bot"
                ? images?.chatbotavatar
                : message?.senderId?.avatar
            }
            alt=""
            className="h-10 w-10"
          />
          <div className="flex flex-col gap-2 max-w-[80%]">
            <div>
              <Typography
                className={`whitespace-pre-line text-sm font-semibold p-3 rounded-bl-xl rounded-br-xl ${
                  user?._id !== message?.senderId?._id || sender === "bot"
                    ? "bg-white text-blue-gray-400 rounded-tl-sm rounded-tr-xl"
                    : "bg-blue-gray-800 text-white rounded-tr-sm rounded-tl-xl"
                }`}
              >
                {message.message}
              </Typography>
            </div>
            <div className="max-w-[70%]">
              {message?.buttons && (
                <div className="flex flex-col gap-1 justify-items-start">
                  {message?.buttons?.map((buttonItem, index) => (
                    <div key={index}>
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
                    </div>
                  ))}
                </div>
              )}
              {message?.employers && (
                <div className="grid grid-cols-3 gap-1">
                  {message?.employers?.map((employer, index) => (
                    <div
                      key={index}
                      to={`/company-profile/${employer?._id}`}
                      className="text-blue-gray-600 border hover:border-blue-500  hover:bg-blue-50 transition-all flex items-center gap-1 p-2 rounded-md bg-white"
                    >
                      <Avatar
                        src={employer?.companyLogo}
                        alt={employer?.companyName}
                        className="bg-blue-gray-500 p-1 !rounded-md"
                      />
                      <div className="flex flex-col ">
                        <TypographyCustom
                          text={employer?.companyName}
                          className="name"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {message?.image && (
                <div className="max-w-[80%] p-2 rounded-md bg-white">
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
                <div className="max-w-[80%] flex flex-col gap-1">
                  {message?.jobs?.map((job) => {
                    return (
                      <div
                        to={`/job-detail/${job?._id}`}
                        key={job?.recruitmentTitle}
                        className="group cursor-pointer hover:bg-blue-50 border hover:border-blue-500 transition-all flex items-center gap-4 p-2 rounded-md bg-white"
                      >
                        <img
                          src={job?.companyLogo}
                          alt=""
                          className="h-20 w-20 flex-none bg-blue-gray-200 rounded-md"
                        />
                        <div className="flex flex-col gap-1">
                          <TypographyCustom text={job?.recruitmentTitle} />
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
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className=" max-w-[70%] flex flex-col gap-1 justify-end">
          <Typography
            className={`whitespace-pre-line text-sm font-semibold p-3 rounded-bl-xl rounded-br-xl ${
              user?._id !== message?.senderId?._id
                ? "bg-white text-blue-gray-400 rounded-tl-sm rounded-tr-xl"
                : "bg-blue-gray-800 text-white rounded-tr-sm rounded-tl-xl"
            }`}
          >
            {message.message}
          </Typography>
          <div className="flex justify-end">
            {message?.buttons && (
              <div className="flex flex-col gap-1 justify-end">
                {message?.buttons.map((buttonItem, index) => (
                  <div key={index}>
                    <button className="border hover:border-blue-500 flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-full cursor-pointer text-sm text-blue-gray-600 hover:bg-blue-50 transition-all">
                      <span>
                        <icons.IoSendSharp />
                      </span>
                      <TypographyCustom
                        text={buttonItem?.title}
                        className="text-xs text-light-blue-600"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {message?.employers && (
              <div className="grid grid-cols-3 gap-1">
                {message?.employers?.map((employer, index) => (
                  <div
                    key={index}
                    to={`/company-profile/${employer?._id}`}
                    className="text-blue-gray-600 border hover:border-blue-500  hover:bg-blue-50 transition-all flex items-center gap-1 p-2 rounded-md bg-white"
                  >
                    <Avatar
                      src={employer?.companyLogo}
                      alt={employer?.companyName}
                      className="bg-blue-gray-500 p-1 !rounded-md"
                    />
                    <div className="flex flex-col ">
                      <TypographyCustom
                        text={employer?.companyName}
                        className="name"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {message?.image && (
              <div className="max-w-[80%] p-2 rounded-md bg-white">
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
              <div className="max-w-[80%] flex flex-col gap-1">
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
                        className="h-20 w-20 flex-none bg-blue-gray-200 rounded-md"
                      />
                      <div className="flex flex-col gap-1">
                        <TypographyCustom text={job?.recruitmentTitle} />
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
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.string,
};

export default Message;
