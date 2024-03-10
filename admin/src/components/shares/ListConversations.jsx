import { Avatar, Input, Typography } from "@material-tailwind/react";
import React from "react";
import { fakeChatListData } from "../../utils/constants";

const ListConversations = () => {
  return (
    <div className="flex flex-col gap-2 p-5">
      <Typography>Danh sách trò chuyện</Typography>
      <Input label="Tìm kiếm" />
      <hr className="my-2 border-blue-gray-100" />
      <div className="flex flex-col gap-3">
        {fakeChatListData.map((item) => {
          return (
            <div
              key={item.id}
              className="w-full flex items-center p-2 gap-3 bg-blue-gray-50 rounded-lg"
            >
              <Avatar
                src={item.avatar}
                alt={item.name}
                className="border-2 border-[#212f3f]"
              />
              <div className="w-full flex flex-col gap-2">
                <Typography className="text-sm font-bold">
                  {item.name}
                </Typography>
                <div className="w-full flex items-center justify-between">
                  <Typography className="text-xs">
                    {item.lastMessage.slice(0, 14)} ...
                  </Typography>
                  <Typography className="text-xs">
                    {item.lastMessageTime}
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
