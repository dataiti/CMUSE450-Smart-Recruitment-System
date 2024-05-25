import React from "react";
import { Avatar } from "@material-tailwind/react";
import PropTypes from "prop-types";

import { TypographyCustom } from "../shares";
import { timeAgo } from "../../utils/fn";
import { icons } from "../../utils/icons";

const ListConversation = ({
  listConversation = [],
  selectedConversation = {},
  searchConversation,
  setSelectedConversation,
  setSearchConversation,
}) => {
  // Hàm xử lý set dữ liệu cho cuộc hội thoại được chọn
  const handleSelectedConversation = ({ conversation }) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="bg-white flex flex-col gap-2 w-[330px] h-[calc(100vh-60px)] overflow-y-auto border-r border-blue-gray-100 p-2">
      <div className="flex items-center gap-2 bg-blue-gray-100 px-4 py-3 rounded-full ">
        <span className="text-light-blue-500">
          <icons.FiSearch size={18} />
        </span>
        <input
          className="outline-none border-none w-full placeholder:text-sm bg-transparent font-semibold text-gray-800 text-sm"
          placeholder="Tìm kiếm"
          spellCheck={false}
          value={searchConversation}
          onChange={(e) => setSearchConversation(e.target.value)}
        />
      </div>
      <hr />
      <ul className="flex flex-col gap-1">
        {listConversation?.map((conversation) => {
          return (
            <li
              key={conversation._id}
              className={`flex items-center gap-3 p-3  transition-all rounded-md cursor-pointer ${
                conversation?._id === selectedConversation?._id
                  ? "bg-cyan-900"
                  : "bg-blue-gray-50 hover:bg-blue-gray-100"
              }`}
              onClick={() => handleSelectedConversation({ conversation })}
            >
              <Avatar
                src={conversation?.sender?.avatar}
                alt={`${conversation?.sender?.firstName} ${conversation?.sender?.lastName}`}
                className="h-11 w-11"
              />
              <div className="flex flex-col gap-1 w-full">
                <div className="w-full flex items-center justify-between">
                  <TypographyCustom
                    text={`${conversation?.sender?.firstName} ${conversation?.sender?.lastName}`}
                    className={`${
                      conversation?._id === selectedConversation?._id
                        ? "font-bold text-light-blue-500"
                        : ""
                    }`}
                  />
                  <span
                    className={`text-[10px] ${
                      conversation?._id === selectedConversation?._id
                        ? "font-bold text-white"
                        : "font-semibold text-gray-700"
                    }`}
                  >
                    {conversation?.lastMessage?.createdAt &&
                      timeAgo(new Date(conversation?.lastMessage?.createdAt))}
                  </span>
                </div>
                <TypographyCustom
                  text={
                    conversation?.lastMessage?.message ||
                    conversation?.lastMessage
                  }
                  className={`text-xs font-semibold name ${
                    conversation?._id === selectedConversation?._id
                      ? "text-white"
                      : " text-gray-600"
                  }`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ListConversation.propTypes = {
  listConversation: PropTypes.array,
  selectedConversation: PropTypes.object,
  setSelectedConversation: PropTypes.func,
};

export default ListConversation;
