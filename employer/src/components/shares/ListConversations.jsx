import { Avatar, Typography } from "@material-tailwind/react";
import React, { useEffect } from "react";
import { socket } from "../../socket";
import { useDispatch } from "react-redux";
import { setCurrentConversation } from "../../redux/features/slices/messageSlice";

const ListConversations = ({ data = [] }) => {
  const dispatch = useDispatch();

  const handleGetMessage = ({ messageId }) => {
    socket.emit("get_messages", {
      messageId,
    });
  };

  useEffect(() => {
    const handleUserGetMessage = (message) => {
      if (message.success)
        dispatch(setCurrentConversation({ data: message.message }));
    };

    socket?.on("user_get_message", handleUserGetMessage);

    return () => {
      socket?.off("user_get_message", handleUserGetMessage);
    };
  }, [dispatch]);

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
        {data?.map((item, index) => {
          return (
            <div
              key={index}
              className="w-full flex items-center p-3 gap-3 bg-blue-gray-50 rounded-lg hover:bg-blue-gray-100 transition-all cursor-pointer"
              onClick={() => handleGetMessage({ messageId: item?._id })}
            >
              <Avatar
                src={item?.userId?.avatar}
                alt={item?.firtName}
                className="border-2 border-gray-300 flex-none"
              />
              <div className="w-full flex flex-col gap-2">
                <Typography className="text-sm font-bold">
                  {item?.userId?.lastName} {item?.userId?.firstName}
                </Typography>
                <div className="w-full flex items-center justify-between name">
                  {item?.lastMessage?.content ? (
                    <Typography className="text-sm font-semibold text-gray-600">
                      {`${
                        item?.lastMessage?.sender === "employer"
                          ? "Bạn: "
                          : `${item?.userId?.firstName}: `
                      }`}{" "}
                      {item?.lastMessage?.content}
                    </Typography>
                  ) : (
                    <Typography className="text-sm font-semibold text-gray-600">
                      Các bạn đã được kết nối trên hệ thống SRS
                    </Typography>
                  )}
                  <Typography className="text-xs">
                    {item?.lastMessage?.createdAt}
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
