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
        className="px-4 py-3 bg-light-blue-50 rounded-full placeholder:text-sm outline-none border-none"
      />
      <hr className="my-2 border-blue-gray-100" />
      <div className="flex flex-col gap-1 h-[calc(100vh-216px)] overflow-y-auto">
        {conversations?.map((conversation, index) => {
          return (
            <div
              key={conversation?.id}
              className={`flex items-center gap-3 p-3  transition-all rounded-md cursor-pointer ${
                conversation?._id === selectedConversation?._id
                  ? "bg-blue-gray-200"
                  : "bg-blue-gray-50 hover:bg-blue-gray-100"
              }`}
              onClick={() => handleSelectedConversation({ conversation })}
            >
              <Avatar
                src={conversation?.userId?.avatar}
                alt={conversation?.firtName}
                className="border-2 border-gray-300 flex-none"
              />
              <div className="w-full flex flex-col gap-2">
                <Typography className="text-sm font-bold">
                  {conversation?.userId?.lastName}{" "}
                  {conversation?.userId?.firstName}
                </Typography>
                <div className="w-full flex items-center justify-between name">
                  {conversation?.lastMessage?.content ? (
                    <Typography className="text-sm font-semibold text-gray-600">
                      {`${
                        conversation?.lastMessage?.sender === "employer"
                          ? "Bạn: "
                          : `${conversation?.userId?.firstName}: `
                      }`}{" "}
                      {conversation?.lastMessage?.content}
                    </Typography>
                  ) : (
                    <Typography className="text-sm font-semibold text-gray-600">
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
