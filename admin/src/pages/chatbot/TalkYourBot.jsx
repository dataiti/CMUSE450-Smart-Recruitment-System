import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import {
  HeaderChatbot,
  FooterChatbot,
  Message,
} from "../../components/chatbot";
import { authSelect } from "../../redux/features/slices/authSlice";
import { sendQuestionApi } from "../../redux/features/apis/rasas/rasaApi";
import { useScrollBottom } from "../../hooks";

const TalkYourBot = () => {
  const { user } = useSelector(authSelect);

  const [inputMessage, setInputMessage] = useState("");
  const [currentConversation, setCurrentConversation] = useState([]);

  const scrollContainerRef = useRef(null);

  // Xử lý tự cuộn xuống dưới cùng khi có tin nhắn mới
  useScrollBottom(scrollContainerRef, currentConversation);

  const sendMessage = async ({ message }) => {
    setCurrentConversation((prevConversation) => [
      ...prevConversation,
      {
        sender: "user",
        message: message,
      },
    ]);

    try {
      const response = await sendQuestionApi({
        data: { sender: "user", message },
      });

      if (response) {
        setCurrentConversation((prevConversation) => [
          ...prevConversation,
          {
            sender: "bot",
            message: {
              message: response[0]?.text || response[0]?.custom?.text,
              buttons: response[0]?.buttons,
              employers: response[0]?.custom?.employers,
              charts: response[0]?.custom?.charts,
              jobs: response[0]?.custom?.jobs,
            },
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Hàm xử lý gửi message
  const handleSendMessage = async () => {
    if (!inputMessage) return;

    setInputMessage("");

    sendMessage({ message: inputMessage });
  };

  // Hàm xử lý gửi message khi nhấn phím Enter
  const handleEnterMessage = async (e) => {
    if (e.key === "Enter") {
      if (!inputMessage) return;

      setInputMessage("");
      sendMessage({ message: inputMessage });
    }
  };

  const handleClickButtonsMessage = ({ message }) => {
    if (!message) return;

    sendMessage({ message });
  };

  return (
    <div className="py-10 px-32">
      <HeaderChatbot title="Trò chuyện với bot của bạn" />
      <div
        className="flex flex-col gap-1 p-3 h-[calc(100vh-200px)] overflow-y-auto w-full bg-gradient-to-r from-[#cbd5e1] to-[#f1f5f9]"
        ref={scrollContainerRef}
      >
        {currentConversation &&
          currentConversation.length > 0 &&
          currentConversation.map((message) => {
            return (
              <Message
                sender={message?.sender}
                message={message?.message}
                key={message?._id}
                onClickRecommentQuestion={handleClickButtonsMessage}
              />
            );
          })}
      </div>
      <FooterChatbot
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onEnterMessage={handleEnterMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default TalkYourBot;
