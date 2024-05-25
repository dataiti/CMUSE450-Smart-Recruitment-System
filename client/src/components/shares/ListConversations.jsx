import { Avatar, Typography } from "@material-tailwind/react";
import React from "react";

const ListConversations = ({
  conversations = [],
  selectedConversation,
  setSelectedConversation,
}) => {
  const handleSelectedConversation = ({ conversation }) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="flex flex-col gap-2 p-5">
      <Typography className="font-bold text-light-blue-600">
        Danh sách trò chuyện
      </Typography>
      <input
        placeholder="Tìm kiếm cuộc trò chuyện"
        className="px-4 py-3 bg-blue-gray-100 rounded-full placeholder:text-sm outline-none border-none"
      />
      <hr className="my-2 border-blue-gray-100" />
      <div className="flex flex-col gap-1">
        {conversations?.map((conversation, index) => {
          return (
            <div
              key={conversation?.id}
              className={`flex items-center gap-3 p-3  transition-all rounded-md cursor-pointer ${
                conversation?._id === selectedConversation?._id
                  ? "bg-blue-gray-300"
                  : "bg-blue-gray-100 hover:bg-blue-gray-100/70"
              }`}
              onClick={() => handleSelectedConversation({ conversation })}
            >
              <Avatar
                src={conversation?.employerId?.companyLogo}
                alt={conversation?.employerId?.companyName}
                className="h-12 w-12 p-1 bg-white !rounded-md border flex-none"
              />
              <div className="w-full flex flex-col gap-2">
                <Typography className="text-sm font-bold text-blue-gray-700 name">
                  {conversation?.employerId?.companyName}
                </Typography>
                <div className="w-full flex items-center justify-between name">
                  {conversation?.lastMessage?.content ? (
                    <Typography className="text-xs font-semibold text-gray-600 italic">
                      {`${
                        conversation?.lastMessage?.sender === "user"
                          ? "Bạn: "
                          : `${conversation?.employerId?.companyName}: `
                      }`}{" "}
                      {conversation?.lastMessage?.content}
                    </Typography>
                  ) : (
                    <Typography className="text-xs font-semibold text-gray-600 italic">
                      Các bạn đã được kết nối trên hệ thống SRS
                    </Typography>
                  )}
                  <Typography className="text-xs">
                    {conversation?.lastMessage?.createdAt}
                  </Typography>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListConversations;
