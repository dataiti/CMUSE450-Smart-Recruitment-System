import React from "react";
import { Avatar } from "@material-tailwind/react";

import { TypographyCustom } from "../shares";
import { timeAgo } from "../../utils/fn";

const ListConversation = ({
  listConversation = [],
  selectedConversation = {},
  setSelectedConversation = () => {},
}) => {
  // Hàm xử lý set dữ liệu cho cuộc hội thoại được chọn
  const handleSelectedConversation = ({ conversation }) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="bg-white flex flex-col gap-2 w-[330px] h-[calc(100vh-60px)] overflow-y-auto border-r border-blue-gray-100 p-2">
      <input
        className="outline-none border-none bg-blue-gray-50 px-4 py-2 rounded-full w-full placeholder:text-sm font-semibold text-gray-600"
        placeholder="Tìm kiếm"
      />
      <hr />
      <ul className="flex flex-col gap-1">
        {listConversation &&
          listConversation.length > 0 &&
          listConversation.map((conversation) => {
            return (
              <li
                key={conversation._id}
                className={`flex items-center gap-3 p-3  transition-all rounded-md cursor-pointer ${
                  conversation?._id === selectedConversation?._id
                    ? "bg-blue-gray-300"
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
                          ? "font-bold text-light-blue-200"
                          : ""
                      }`}
                    />
                    <span className="text-[10px] text-gray-800 font-semibold">
                      {timeAgo(new Date(conversation?.lastMessage?.createdAt))}
                    </span>
                  </div>
                  <TypographyCustom
                    text={
                      conversation?.lastMessage?.message ||
                      conversation?.lastMessage
                    }
                    className={`text-xs font-semibold name  ${
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

export default ListConversation;
