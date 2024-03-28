import React, { useEffect, useRef, useState } from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import { useSelector } from "react-redux";

import { icons } from "../../utils/icons";
import { IconButtonCustom } from "../shares";
import { sendQuestionApi } from "../../redux/features/apis/rasaApi";
import { images } from "../../assets/images";
import { authSelect } from "../../redux/features/slices/authSlice";
import { socket } from "../../socket";
import { Message } from "../../components/chatbot";

const RasaBoxChat = ({ setIsBoxChatOpen, setIsBoxChatBubble }) => {
  const { user } = useSelector(authSelect);

  const [inputMessage, setInputMessage] = useState("");
  const [currentConversation, setCurrentConversation] = useState({});
  const [isIncreaseSize, setIsIncreaseSize] = useState(false);

  const scrollContainerRef = useRef(null);

  // Xử lý tự cuộn xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [currentConversation]);

  // Xử lý tải cuộc trò chuyện khi component được tải lần đầu
  useEffect(() => {
    if (socket) {
      socket.on("conversation_started_with_chatbot", ({ success, data }) => {
        try {
          if (success) {
            setCurrentConversation(data);
          } else {
            console.error("Failed to start conversation:", data);
          }
        } catch (error) {
          console.error(error);
        }
      });

      // Gửi sự kiện bắt đầu đoạn chat
      socket.emit("start_conversation_with_rasa_chatbot", {
        from: user?._id,
        to: process.env.REACT_APP_ADMIN_ID,
      });

      // Lắng nghe sự kiện nhận được câu hỏi từ Rasa Chatbot
      socket.on("question_sent_to_rasa_chatbot", ({ success, data }) => {
        try {
          if (success) {
            setCurrentConversation((prev) => {
              return {
                ...prev,
                messageIds: [...prev.messageIds, data],
              };
            });
            setInputMessage("");
          } else {
            console.error("Failed to start conversation:", data);
          }
        } catch (error) {
          console.error(error);
        }
      });
    }

    return () => {
      socket.off("conversation_started_with_chatbot");
      socket.off("question_sent_to_rasa_chatbot");
    };
  }, [user]);

  // Hàm xử lý gửi một message đến chabot
  const sendMessage = async () => {
    try {
      socket?.emit("send_question_rasa_chatbot", {
        from: user?._id,
        to: process.env.REACT_APP_ADMIN_ID,
        message: inputMessage,
        conversationId: currentConversation?._id,
      });

      // Gọi request đến rasa server
      const response = await sendQuestionApi({
        data: { sender: "Dat", message: inputMessage },
      });

      // Nếu có rasa phản hồi thì tiến hành gửi socket lưu vào DB
      if (response) {
        const temp = response[0];
        const recipient_msg = temp["text"];

        socket?.emit("send_question_rasa_chatbot", {
          from: process.env.REACT_APP_ADMIN_ID,
          to: user?._id,
          message: recipient_msg,
          conversationId: currentConversation?._id,
        });
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

  // Hàm toggle kích thước hôp chat
  const handleIncreaseSize = () => {
    setIsIncreaseSize((prev) => !prev);
  };

  // Hàm xử lý tắt hộp chat
  const handleCloseBoxChat = () => {
    setIsBoxChatBubble(true);
    setIsBoxChatOpen(false);
  };

  return (
    <div
      className={`fixed bottom-5 right-5 shadow-2xl z-40 rounded-xl overflow-hidden border border-gray-400 transition-all ${
        isIncreaseSize
          ? "h-[calc(100vh-100px)] w-[calc(100vw/2)] "
          : "h-[550px] w-[450px]"
      }`}
    >
      <div className="h-[60px] w-full p-2 bg-white border-b border-blue-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Avatar
            src={images.chatbotavatar}
            className="bg-[#212f3f] p-2 h-11 w-11"
          />
          <div className="flex flex-col">
            <Typography className="text-sm font-bold">
              SmartHire Chatbot
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="hover:bg-blue-gray-300 p-2 rounded-full transition-all"
            onClick={() => handleIncreaseSize()}
          >
            <icons.BsArrowsFullscreen size={16} />
          </button>
          <button
            className="hover:bg-blue-gray-300 p-1 rounded-full transition-all"
            onClick={() => handleCloseBoxChat()}
          >
            <icons.IoRemove size={24} />
          </button>
        </div>
      </div>
      <div
        className={`${
          isIncreaseSize
            ? "h-[calc(100vh-100px-120px)]"
            : "h-[calc(550px-120px)]"
        } transition-all flex flex-col gap-1 w-full overflow-y-auto p-3 bg-gradient-to-r from-[#cbd5e1] to-[#f1f5f9]`}
        ref={scrollContainerRef}
      >
        {currentConversation &&
          currentConversation.messageIds &&
          currentConversation.messageIds.length > 0 &&
          currentConversation.messageIds.map((message) => {
            return <Message message={message} key={message?._id} />;
          })}
      </div>
      <div className="h-[60px] p-2 flex items-center gap-2 bg-white">
        <input
          className="outline-none border-none flex-1 bg-gray-200 rounded-md p-[10px] placeholder:text-gray-600 text-sm font-bold"
          placeholder="Nhập tin nhắn"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleEnterMessage}
        />
        <IconButtonCustom className="rounded-md" onClick={handleSendMessage}>
          <icons.IoSendSharp />
        </IconButtonCustom>
      </div>
    </div>
  );
};

export default RasaBoxChat;
