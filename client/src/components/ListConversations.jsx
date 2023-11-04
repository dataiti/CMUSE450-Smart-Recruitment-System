import React from "react";
import { Avatar, Input, Typography } from "@material-tailwind/react";
import { timeAgo } from "../utils/fn";
import { socket } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import { authSelect } from "../redux/features/slices/authSlice";
import {
  messageSelect,
  setCurrentMessage,
} from "../redux/features/slices/messageSlice";

const ListConversations = ({ conversations }) => {
  const dispatch = useDispatch();

  const { currentMessages } = useSelector(messageSelect);

  const { user } = useSelector(authSelect);

  const handleClickConversation = ({ conversationId }) => {
    socket.emit("get_messages", { conversationId, userId: user?._id });

    socket.on("user_get_message", ({ message }) => {
      dispatch(setCurrentMessage({ messageData: message, userId: user?._id }));
    });
  };

  return (
    <div className="w-full h-full bg-white">
      <div className="flex flex-col gap-2 p-5">
        <Typography className="text-light-blue-500 font-bold text-sm">
          Danh sách trò chuyện
        </Typography>
        <input
          className="p-3 bg-blue-gray-50 rounded-full"
          placeholder="Tìm kiếm cuộc trò chuyện"
        />
        <hr className="my-2 border-blue-gray-100" />
        <div className="flex flex-col gap-3">
          {conversations?.map((item) => {
            return (
              <div
                key={item?._id}
                className="w-full flex items-center p-3 gap-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all cursor-pointer"
                onClick={() =>
                  handleClickConversation({ conversationId: item?._id })
                }
              >
                <Avatar
                  src={item?.sender?.avatar}
                  alt={item?.sender?.email}
                  className="border-2 border-[#212f3f]"
                />
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full flex items-center justify-between">
                    <Typography className="text-sm font-bold text-light-blue-500">
                      {item?.sender?.firstName} {item?.sender?.lastName}
                    </Typography>
                    <Typography className="text-xs font-bol text-gray-600 italic">
                      {item?.lastMessages?.createdAt &&
                        timeAgo(new Date(item?.lastMessages?.createdAt))}
                    </Typography>
                  </div>
                  <Typography className="text-xs name font-bold">
                    {item?.lastMessages?.text
                      ? item?.lastMessages?.text
                      : "Các bạn đã được kết nối trên hệ thống SRS"}
                  </Typography>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListConversations;
