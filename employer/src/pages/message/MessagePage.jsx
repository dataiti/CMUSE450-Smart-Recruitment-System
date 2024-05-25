import React, { useEffect, useRef, useState } from "react";
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
import { setTitle } from "../../redux/features/slices/titleSlice";
import { useDispatch, useSelector } from "react-redux";
import { images } from "../../assets/images";
import { authSelect } from "../../redux/features/slices/authSlice";
import { socket } from "../../socket";

import { useScrollBottom } from "../../hooks";

const MessagePage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(authSelect);

  const [openPicker, setOpenPicker] = useState(false);
  const [inputMesssageValue, setInputMessageValue] = useState("");
  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    dispatch(setTitle("Tin nhắn"));
  }, [dispatch]);

  useScrollBottom(scrollContainerRef, currentConversation);

  useEffect(() => {
    if (socket) {
      socket.emit("employer_list_conversations", {
        employerId: user?.ownerEmployerId?._id,
      });

      socket.on("employer_get_list_conversations", handleGetConversations);

      socket.emit("start_conversation", {
        employerId: user?.ownerEmployerId?._id,
        userId: selectedConversation?.userId,
      });

      socket.on("start_chat", handleStartConversation);

      socket.on("new_message", handleSetCurrentConversation);
    }

    // Xóa các sự kiện lắng nghe khi component bị unMount
    return () => {
      socket.off("employer_get_list_conversations", handleGetConversations);
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
          sender: "employer",
          content: inputMesssageValue,
          employerId: currentConversation?.employerId?._id,
          userId: currentConversation?.userId?._id,
          type: "text",
          messageId: currentConversation?._id,
        });
      }
      setInputMessageValue("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickSendMessage = () => {
    sendMessage();
  };

  const handleEnterMessage = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  console.log(inputMesssageValue);

  return (
    <div className="w-full flex">
      <div className=" w-[480px] bg-white border-r border-blue-gray-100">
        <ListConversations
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      </div>
      <div className="h-full w-full">
        {currentConversation ? (
          <>
            <div className="h-[60px] bg-white border-b border-blue-gray-100 flex items-center justify-between gap-3 px-4">
              <div className="flex items-center gap-2">
                <Avatar
                  src={currentConversation?.userId?.avatar}
                  className="border-2 border-gray-500"
                />
                <div className="flex flex-col">
                  <Typography className="text-sm font-bold">
                    {currentConversation?.userId?.firstName}{" "}
                    {currentConversation?.userId?.lastName}
                  </Typography>
                  <Typography className="text-xs text-gray-600 italic">
                    {currentConversation?.userId?.email}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <icons.BsCameraVideo size={20} />
                <icons.BsTelephone size={20} />
                <icons.FiSearch size={20} />
              </div>
            </div>
            <div
              className="h-[calc(100vh-180px)] overflow-auto flex flex-col gap-1 p-4"
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
                        user={currentConversation?.userId}
                        key={index}
                      />
                    );
                }
              })}
            </div>
            <div className="h-[60px] flex items-center gap-2 justify-center px-4 bg-white border-t border-blue-gray-100">
              <Input
                label="Nhập tin nhắn"
                icon={
                  <icons.FaFaceSmile
                    size={20}
                    onClick={() => {
                      setOpenPicker(!openPicker);
                    }}
                    className="cursor-pointer hover:text-blue-gray-400"
                  />
                }
                values={inputMesssageValue}
                onChange={(e) => setInputMessageValue(e.target.value)}
                onKeyDown={handleEnterMessage}
                className="bg-transparent"
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
          <div className="h-[calc(100vh-60px)] w-full bg-white flex items-center justify-center">
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
