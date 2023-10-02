import React, { useState } from "react";
import ListConversations from "../../components/ListConversations";
import { fakeDataMessage, recruitmentChatData } from "../../utils/constants";
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

const MessagePage = () => {
  const [openPicker, setOpenPicker] = useState(false);
  const [inputValue, setInputValue] = useState(false);

  const handleClickEmoji = () => {};

  return (
    <div className="w-full flex">
      <div className="h-full w-full">
        <div className="h-[60px] bg-white border-b border-blue-gray-100 flex items-center gap-3 px-4">
          <Avatar
            src="https://res.cloudinary.com/doo78f14s/image/upload/v1677427616/CDIO2-project/dedault_jd3qnu.jpg"
            className="border-2 border-[#212f3f]"
          />
          <div className="flex flex-col">
            <Typography className="text-xs">Nguyễn Van A</Typography>
            <Typography className="text-xs">nguyenvana@gmail.com</Typography>
          </div>
        </div>
        <div className="h-[calc(100vh-180px)] overflow-auto flex flex-col gap-3 p-4">
          {recruitmentChatData.map((el, index) => {
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
        <div className="h-[60px] flex items-center gap-2 justify-center px-8 bg-white border-t border-blue-gray-100">
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
          <IconButton>
            <icons.IoSendSharp size={20} />
          </IconButton>
        </div>
      </div>
      <div className="w-[400px] bg-white border-l border-blue-gray-100">
        <ListConversations />
      </div>
    </div>
  );
};

export default MessagePage;
