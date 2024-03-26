import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "@material-tailwind/react";
import { useSelector } from "react-redux";

import {
  FooterChatbot,
  HeaderChatbot,
  ListConversation,
  Message,
} from "../../components/chatbot";
import { socket } from "../../socket";
import { authSelect } from "../../redux/features/slices/authSlice";
import { TypographyCustom } from "../../components/shares";
import { images } from "../../assets/images";

const Conversation = () => {
  const { user } = useSelector(authSelect);

  const [inputMessage, setInputMessage] = useState("");
  const [currentConversation, setCurrentConversation] = useState({});
  const [listConversation, setListConversation] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const scrollContainerRef = useRef(null);

  // Xử lý tự cuộn xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [currentConversation]);

  // Xử lý lắng nghe các sự kiện khi component được mount
  useEffect(() => {
    if (socket) {
      handleGetListConversation();

      // Lắng nghe sự kiện bắt đầu cuộc trò chuyện với Rasa Chatbot
      socket.on("question_sent_to_rasa_chatbot", ({ success, data }) => {
        try {
          if (success && selectedConversation?._id === data.conversationId) {
            setCurrentConversation((prev) => ({
              ...prev,
              messageIds: [...prev.messageIds, data],
            }));

            handleGetListConversation();
          }
          setInputMessage("");
        } catch (error) {
          console.error(error);
        }
      });

      // Lắng nghe sự kiện nhận câu hỏi từ Rasa Chatbot
      socket.on("conversation_started_with_chatbot", ({ success, data }) => {
        try {
          if (success) {
            setCurrentConversation(data);
          }
        } catch (error) {
          console.error(error);
        }
      });

      // Gửi sự kiện lấy dữ liệu khi bắt đầu một cuộc trò chuyện
      socket.emit("start_conversation_with_rasa_chatbot", {
        from: user?._id,
        to: selectedConversation?.sender?._id,
      });

      // Xóa các sự kiện lắng nghe khi component bị unMount
      return () => {
        socket.off("question_sent_to_rasa_chatbot");
        socket.off("conversation_started_with_chatbot");
        socket.off("get_list_conversations_rasa_chatbot");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedConversation]);

  // Hàm xử lý lấy danh sách các cuộc trò chuyện
  const handleGetListConversation = () => {
    socket.on("get_list_conversations_rasa_chatbot", ({ success, data }) => {
      if (success) {
        setListConversation(data);
      } else {
        console.error("Failed to start conversation:", data);
      }
    });

    // Gửi sự kiện bắt đầu đoạn chat
    socket.emit("list_conversations_rasa_chatbot", {
      userId: user?._id,
    });
  };

  // Hàm xử lý gửi message
  const handleSendMessage = async () => {
    if (!inputMessage) return;
    // sendMessage();
  };

  // Hàm xử lý gửi message khi nhấn phím Enter
  const handleEnterMessage = async (e) => {
    if (!inputMessage) return;
    else if (e.key === "Enter") {
      // sendMessage();
    }
  };

  return (
    <div className="h-screen w-full">
      <HeaderChatbot title="Cuộc trò chuyện" />
      <div className="w-full flex">
        <ListConversation
          listConversation={listConversation}
          setSelectedConversation={setSelectedConversation}
          selectedConversation={selectedConversation}
        />
        {selectedConversation ? (
          <div className="h-[calc(100vh-60px)] w-[calc(100%-330px)] bg-white">
            <div className="h-[60px] border-b border-blue-gray-100 flex items-center gap-3 px-4">
              <Avatar
                src={selectedConversation?.sender?.avatar}
                alt={`${selectedConversation?.sender?.firstName} ${selectedConversation?.sender?.lastName}`}
                className="h-11 w-11"
              />
              <div className="flex flex-col gap-1">
                <TypographyCustom
                  text={`${selectedConversation?.sender?.firstName} ${selectedConversation?.sender?.lastName}`}
                />
                <TypographyCustom
                  text={`${selectedConversation?.sender?.email}`}
                  className="text-xs text-gray-600"
                />
              </div>
            </div>
            <div
              className="flex flex-col gap-1 p-3 h-[calc(100vh-180px)] overflow-y-auto w-full bg-gradient-to-r from-[#cbd5e1] to-[#f1f5f9]"
              ref={scrollContainerRef}
            >
              {currentConversation &&
                currentConversation.messageIds &&
                currentConversation.messageIds.length > 0 &&
                currentConversation.messageIds.map((message) => {
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
        ) : (
          <div className="h-[calc(100vh-60px)] w-[calc(100%-330px)] bg-white p-3 flex items-center justify-center">
            <img src={images.noconversation} alt="No conversation" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversation;
