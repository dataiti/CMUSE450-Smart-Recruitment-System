import React, { useState } from "react";
import ListConversations from "../../components/ListConversations";
import { fakeDataMessage } from "../../utils/constants";
import {
  MediaMessage,
  ReplyMessage,
  TextMessage,
} from "../../components/TypeMessage";
import {
  Avatar,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useEffect } from "react";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import {
  messageSelect,
  setCurrentMessage,
  setListConversations,
} from "../../redux/features/slices/messageSlice";

const MessagePage = () => {
  const dispatch = useDispatch();

  const {
    conversations,
    currentMessages,
    currentConversation,
    conversationId,
  } = useSelector(messageSelect);

  const [openPicker, setOpenPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { user } = useSelector(authSelect);

  useEffect(() => {
    if (socket) {
      socket.emit("get_direct_conversations", { userId: user?._id });

      socket.on("user_get_direct_conversations", ({ message }) => {
        dispatch(
          setListConversations({ conversations: message, userId: user?._id })
        );
      });
    }
  }, [user?._id, dispatch]);

  socket?.on("new_message", ({ message }) => {
    console.log(message);
    dispatch(setCurrentMessage({ messageData: message, userId: user?._id }));
  });

  const handleClickEmoji = () => {};

  console.log(currentMessages);

  const handleSendMessage = () => {
    socket.emit("text_message", {
      to: currentConversation?._id,
      from: user?._id,
      message: inputValue,
      type: "Text",
      conversationId,
    });
  };

  return (
    <div className="w-full flex">
      <div className="!w-[460px] h-screen border-r border-gray-500">
        <ListConversations conversations={conversations} />
      </div>
      <div className="h-screen w-full">
        <div className="h-[80px] px-6 bg-white border-b border-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              src={currentConversation?.avatar}
              className="border-2 border-[#212f3f]"
            />
            <div className="flex flex-col">
              <Typography className="text-sm font-bold">
                {currentConversation?.firstName} {currentConversation?.lastName}
              </Typography>
              <Typography className="text-sm text-gray-600 italic">
                {currentConversation?.email}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <icons.BsCameraVideo size={20} />
            <icons.BsTelephone size={20} />
            <icons.FiSearch size={20} />
          </div>
        </div>
        <div className="h-[calc(100vh-160px)] overflow-auto flex flex-col gap-1 p-4 bg-[#e8edf2]">
          {currentMessages?.map((el, index) => {
            switch (el.type) {
              case "img":
                return <MediaMessage el={el} key={index} />;
              case "reply":
                return <ReplyMessage el={el} key={index} />;
              default:
                return <TextMessage el={el} key={index} />;
            }
          })}
        </div>
        <div className="h-[80px] flex items-center gap-2 justify-center px-8 bg-white border-t border-gray-500">
          <Input
            label="Nhập tin nhắn"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            icon={
              <icons.FaFaceSmile
                size={20}
                onClick={() => {
                  setOpenPicker(!openPicker);
                }}
                className="cursor-pointer hover:text-blue-gray-400"
              />
            }
            className="!bg-blue-gray-100/70"
          />
          <div
            className={`fixed z-10 ${openPicker ? "inline" : "hidden"}`}
            style={{
              bottom: "3rem",
              right: "6.25rem",
            }}
          >
            <Picker
              data={data}
              onEmojiSelect={(emoji) => handleClickEmoji(emoji.native)}
            />
          </div>
          <IconButton onClick={handleSendMessage}>
            <icons.IoSendSharp size={20} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
