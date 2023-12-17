import React, { useEffect, useState } from "react";
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
import {
  messageSelect,
  setCurrentConversation,
  setListConversations,
} from "../../redux/features/slices/messageSlice";

const MessagePage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(authSelect);
  const { listConversations, currentConversation } = useSelector(messageSelect);

  const [openPicker, setOpenPicker] = useState(false);
  const [inputMesssageValue, setInputMessageValue] = useState("");

  useEffect(() => {
    dispatch(setTitle("Tin nhắn"));
  }, [dispatch]);

  useEffect(() => {
    if (socket) {
      socket.emit("employer_list_conversations", {
        employerId: user?.ownerEmployerId?._id,
      });

      socket.on("employer_get_list_conversations", ({ message }) => {
        dispatch(setListConversations({ data: message }));
      });
    }
  }, [user?.ownerEmployerId?._id, dispatch]);

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

  const handleSendMessage = () => {
    socket.emit("text_message", {
      sender: "employer",
      content: inputMesssageValue,
      employerId: currentConversation?.employerId?._id,
      userId: currentConversation?.userId?._id,
      type: "text",
      messageId: currentConversation?._id,
    });
    setInputMessageValue("");
  };

  return (
    <div className="w-full flex">
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
            <div className="h-[calc(100vh-180px)] overflow-auto flex flex-col gap-1 p-4">
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
              <IconButton onClick={handleSendMessage} className="!bg-teal-700">
                <icons.IoSendSharp size={20} />
              </IconButton>
            </div>
          </>
        ) : (
          <div className="h-[calc(100vh-60px)] w-full bg-white flex items-center justify-center">
            <img
              src={images.startchat}
              alt=""
              className="h-[300px] w-[300px] object-cover"
            />
          </div>
        )}
      </div>
      <div className="h-[calc(100vh-60px)] overscroll-y-auto w-[480px] bg-white border-l border-blue-gray-100">
        <ListConversations data={listConversations} />
      </div>
    </div>
  );
};

export default MessagePage;
