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
        className="px-4 py-3 bg-blue-gray-900 rounded-full placeholder:text-sm outline-none border-none"
      />
      <hr className="my-2 border-blue-gray-100" />
      <div className="flex flex-col gap-3">
        {data?.map((item) => {
          return (
            <div
              key={item?.id}
              className="w-full flex items-center p-3 gap-3 bg-blue-gray-500 rounded-lg hover:bg-blue-gray-700 transition-all cursor-pointer"
              onClick={() => handleGetMessage({ messageId: item?._id })}
            >
              <Avatar
                src={item?.employerId?.companyLogo}
                alt={item?.employerId?.companyName}
                className="h-14 w-14 p-2 bg-blue-gray-100 rounded-full flex-none"
              />
              <div className="w-full flex flex-col gap-2">
                <Typography className="text-sm font-bold text-white">
                  {item?.employerId?.companyName}
                </Typography>
                <div className="w-full flex items-center justify-between name">
                  {item?.lastMessage?.content ? (
                    <Typography className="text-sm font-semibold text-gray-400 italic">
                      {`${
                        item?.lastMessage?.sender === "user"
                          ? "Bạn: "
                          : `${item?.employerId?.companyName}: `
                      }`}{" "}
                      {item?.lastMessage?.content}
                    </Typography>
                  ) : (
                    <Typography className="text-sm font-semibold text-gray-400 italic">
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
