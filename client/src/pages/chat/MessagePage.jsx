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
import { images } from "../../assets/images";
import { useRef } from "react";
import { useScrollBottom } from "../../hooks";

const MessagePage = () => {
  const { user } = useSelector(authSelect);

  const [openPicker, setOpenPicker] = useState(false);
  const [inputMesssageValue, setInputMessageValue] = useState("");
  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const scrollContainerRef = useRef(null);

  useScrollBottom(scrollContainerRef, currentConversation);

  useEffect(() => {
    if (socket) {
      socket.emit("user_list_conversations", {
        userId: user?._id,
      });

      socket.on("user_get_list_conversations", handleGetConversations);

      socket.emit("start_conversation", {
        employerId: selectedConversation?.employerId?._id,
        userId: user?._id,
      });

      socket.on("start_chat", handleStartConversation);

      socket.on("new_message", handleSetCurrentConversation);
    }

    // Xóa các sự kiện lắng nghe khi component bị unMount
    return () => {
      socket.off("user_get_list_conversations", handleGetConversations);
      socket.off("start_chat", handleStartConversation);
      socket.off("new_message", handleSetCurrentConversation);
    };
  }, [socket, user, selectedConversation]);

  const handleGetConversations = ({ message }) => {
    setConversations(message);
  };

  const handleStartConversation = (data) => {
    if (data && data.success) setCurrentConversation(data.message);
  };

  const handleSetCurrentConversation = (data) => {
    if (data && data.success) {
      setCurrentConversation(data.message);
    }
  };

  const handleClickEmoji = () => {};

  const sendMessage = async () => {
    if (!inputMesssageValue) return;

    try {
      if (socket) {
        socket.emit("text_message", {
          sender: "user",
          content: inputMesssageValue,
          employerId: currentConversation?.employerId?._id,
          userId: currentConversation?.userId?._id,
          type: "text",
          messageId: currentConversation?._id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickSendMessage = async () => {
    setInputMessageValue("");

    sendMessage();
  };

  const handleEnterMessage = async (e) => {
    setInputMessageValue("");

    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="w-full flex">
      <div className="!w-[460px] h-screen bg-blue-gray-50 border-r border-blue-gray-200">
        <ListConversations
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      </div>
      <div className="h-screen w-full">
        {currentConversation ? (
          <>
            <div className="h-[70px] bg-blue-gray-50 flex items-center justify-between gap-3 px-4 border-b border-blue-gray-200">
              <div className="flex items-center gap-2">
                <Avatar
                  src={currentConversation?.employerId?.companyLogo}
                  className="h-12 w-12 p-1 bg-blue-gray-200"
                />
                <div className="flex flex-col">
                  <Typography className="text-base font-bold text-blue-gray-700">
                    {currentConversation?.employerId?.companyName}
                  </Typography>
                  <Typography className="text-sm text-gray-600 italic">
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
            <div
              className="h-[calc(100vh-140px)] overflow-auto flex flex-col gap-1 p-4"
              ref={scrollContainerRef}
            >
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
            <div className="h-[70px] flex items-center gap-2 justify-center px-8 pr-20 bg-blue-gray-50 border-t border-blue-gray-200">
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
                onKeyDown={handleEnterMessage}
                className="bg-transparent placeholder:text-gray-600 text-gray-600 font-bold"
                spellCheck={false}
                color="blue"
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
              <IconButton
                onClick={handleClickSendMessage}
                className="!bg-teal-700"
              >
                <icons.IoSendSharp size={20} />
              </IconButton>
            </div>
          </>
        ) : (
          <div className="h-screen w-full bg-white flex items-center justify-center">
            <img
              src={images.startchat}
              alt=""
              className="w-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
