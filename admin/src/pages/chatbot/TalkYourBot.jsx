import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { sendQuestionApi } from "../../redux/features/apis/rasas/rasaApi";
import { authSelect } from "../../redux/features/slices/authSlice";
import {
  FooterChatbot,
  HeaderChatbot,
  Message,
} from "../../components/chatbot";
import { images } from "../../assets/images";

const TalkYourBot = () => {
  const { user } = useSelector(authSelect);

  const [inputMessage, setInputMessage] = useState([]);
  const [currentConversation, setCurrentConversation] = useState([]);

  const scrollContainerRef = useRef(null);

  // Xử lý tự cuộn xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [currentConversation]);

  // Hàm xử lý gửi một message đến chabot
  const sendMessage = async () => {
    try {
      setInputMessage("");
      if (!inputMessage) return;
      else {
        setCurrentConversation((prevConversation) => [
          ...prevConversation,
          { senderId: user, message: inputMessage },
        ]);

        const response = await sendQuestionApi({
          data: { sender: "user", message: inputMessage },
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
      }
    } catch (error) {}
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
    <div className="h-screen w-full">
      <HeaderChatbot title="Trò chuyện với bot" />
      <div className="flex">
        <div className="flex-1 border-r border-blue-gray-100 ">
          {currentConversation.length > 0 ? (
            <div
              className="flex flex-col gap-1 p-3 w-full bg-gradient-to-r from-[#cbd5e1] to-[#f1f5f9] flex-1 h-[calc(100vh-120px)] overflow-y-auto"
              ref={scrollContainerRef}
            >
              {currentConversation?.map((message) => {
                return <Message message={message} key={message?._id} />;
              })}
            </div>
          ) : (
            <div className="w-full bg-white flex-1">
              <img
                src={images.chatbotdefault}
                alt="chatbotdefault"
                className="p-32"
              />
            </div>
          )}
          <FooterChatbot
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onEnterMessage={handleEnterMessage}
            onSendMessage={handleSendMessage}
          />
        </div>
        <div className="flex-1 bg-white">current story and slots component</div>
      </div>
    </div>
  );
};

export default TalkYourBot;
