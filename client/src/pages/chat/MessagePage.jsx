import React, { useState } from "react";
import ListConversations from "../../components/ListConversations";
import { fakeDataMessage } from "../../utils/constants";
import {
  MediaMessage,
  ReplyMessage,
  TextMessage,
} from "../../components/TypeMessage";
import { IconButton, Input } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const MessagePage = () => {
  const [openPicker, setOpenPicker] = useState(false);
  const [inputValue, setInputValue] = useState(false);

  const handleClickEmoji = () => {};

  return (
    <div className="w-full flex">
      <div className="w-[400px] h-screen border-r border-gray-500">
        <ListConversations />
      </div>
      <div className="h-screen w-full">
        <div className="h-[80px] bg-white border-b border-gray-500"></div>
        <div className="h-[calc(100vh-160px)] overflow-auto flex flex-col gap-3 p-4 bg-[#e8edf2]">
          {fakeDataMessage.map((el, index) => {
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
    </div>
  );
};

export default MessagePage;
