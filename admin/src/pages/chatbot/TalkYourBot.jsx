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

const TalkYourBotPage = () => {
  const { user } = useSelector(authSelect);

  const [inputMessage, setInputMessage] = useState("");
  const [currentConversation, setCurrentConversation] = useState([]);

  const scrollContainerRef = useRef(null);

  // Xử lý tự cuộn xuống dưới cùng khi có tin nhắn mới
  useScrollBottom(scrollContainerRef, currentConversation);

  const sendMessage = async () => {
    if (!inputMessage) return;

    setInputMessage("");

    setCurrentConversation((prevConversation) => [
      ...prevConversation,
      {
        senderId: user?._id,
        message: inputMessage,
      },
    ]);

    try {
      const response = await sendQuestionApi({
        data: { sender: "bot", message: inputMessage },
      });

      if (response) {
        setCurrentConversation((prevConversation) => [
          ...prevConversation,
          {
            senderId: response[0].recipient_id,
            message: response[0].text,
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Hàm xử lý gửi message
  const handleSendMessage = async () => {
    sendMessage();
  };

  // Hàm xử lý gửi message khi nhấn phím Enter
  const handleEnterMessage = async (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <HeaderChatbot title="Trò chuyện với bot của bạn" />
      <div
        className="flex flex-col gap-1 p-3 h-[calc(100vh-120px)] overflow-y-auto w-full bg-gradient-to-r from-[#cbd5e1] to-[#f1f5f9]"
        ref={scrollContainerRef}
      >
        {currentConversation &&
          currentConversation.length > 0 &&
          currentConversation.map((message) => {
            return <Message message={message} key={message?._id} />;
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

export default TalkYourBotPage;
