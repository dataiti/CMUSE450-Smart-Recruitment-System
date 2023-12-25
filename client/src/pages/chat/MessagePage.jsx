import React, { useState } from "react";
import { ListConversations } from "../../components/shares";
import {
  MediaMessage,
  ReplyMessage,
  TextMessage,
} from "../../components/shares/TypeMessage";
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
  setCurrentConversation,
  setListConversations,
} from "../../redux/features/slices/messageSlice";
import { images } from "../../assets/images";

const MessagePage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(authSelect);
  const { listConversations, currentConversation } = useSelector(messageSelect);

  const [openPicker, setOpenPicker] = useState(false);
  const [inputMesssageValue, setInputMessageValue] = useState("");

  useEffect(() => {
    if (socket) {
      socket.emit("user_list_conversations", {
        userId: user?._id,
      });

      socket.on("user_get_list_conversations", ({ message }) => {
        dispatch(setListConversations({ data: message }));
      });
    }
  }, [user?._id, dispatch]);

  useEffect(() => {
    const handleUserGetMessage = (message) => {
      if (message.success)
        dispatch(setCurrentConversation({ data: message.message }));
    };

    socket?.on("new_message", handleUserGetMessage);

    return () => {
      socket?.off("new_message", handleUserGetMessage);
    };
  }, [dispatch]);

  const handleClickEmoji = () => {};

  const sendMessageEvent = () => {
    setInputMessageValue("");
    socket.emit("text_message", {
      sender: "user",
      content: inputMesssageValue,
      employerId: currentConversation?.employerId?._id,
      userId: currentConversation?.userId?._id,
      type: "text",
      messageId: currentConversation?._id,
    });
  };

  const handleSendMessage = () => {
    sendMessageEvent();
  };

  const handleSendTextMessage = (e) => {
    if (e.key === "Enter") {
      sendMessageEvent();
    }
  };

  return (
    <div className="w-full flex">
      <div className="!w-[460px] h-screen bg-blue-gray-800">
        <ListConversations data={listConversations} />
      </div>
      <div className="h-screen w-full">
        {currentConversation ? (
          <>
            <div className="h-[70px] bg-blue-gray-900 flex items-center justify-between gap-3 px-4">
              <div className="flex items-center gap-2">
                <Avatar
                  src={currentConversation?.employerId?.companyLogo}
                  className="h-12 w-12 p-1 bg-blue-gray-100"
                />
                <div className="flex flex-col">
                  <Typography className="text-base font-bold text-white">
                    {currentConversation?.employerId?.companyName}
                  </Typography>
                  <Typography className="text-sm text-gray-400 italic">
                    {currentConversation?.employerId?.companyEmail}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white">
                <icons.BsCameraVideo size={20} />
                <icons.BsTelephone size={20} />
                <icons.FiSearch size={20} />
              </div>
            </div>
            <div className="h-[calc(100vh-140px)] overflow-auto flex flex-col gap-1 p-4">
              {currentConversation?.messages?.map((el, index) => {
                switch (el.type) {
                  case "img":
                    return <MediaMessage el={el} key={index} />;
                  case "reply":
                    return <ReplyMessage el={el} key={index} />;
                  default:
                    return (
                      <TextMessage
                        el={el}
                        employer={currentConversation?.employerId}
                        key={index}
                      />
                    );
                }
              })}
            </div>
            <div className="h-[70px] flex items-center gap-2 justify-center px-8 pr-20 bg-blue-gray-900">
              <Input
                label="Nhập tin nhắn"
                icon={
                  <icons.FaFaceSmile
                    size={20}
                    onClick={() => {
                      setOpenPicker(!openPicker);
                    }}
                    className="cursor-pointer hover:text-white text-white"
                  />
                }
                values={inputMesssageValue}
                onChange={(e) => setInputMessageValue(e.target.value)}
                onKeyDown={handleSendTextMessage}
                className="!bg-blue-gray-700 placeholder:text-white text-white font-bold"
                spellCheck={false}
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
              <IconButton onClick={handleSendMessage} className="!bg-teal-700">
                <icons.IoSendSharp size={20} />
              </IconButton>
            </div>
          </>
        ) : (
          <div className="h-screen w-full bg-white flex items-center justify-center">
            <img
              src={images.startchat}
              alt=""
              className="h-[300px] w-[300px] object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
