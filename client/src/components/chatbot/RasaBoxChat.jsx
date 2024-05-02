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
  const [isIncreaseSize, setIsIncreaseSize] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppearMesage, setIsAppearMesage] = useState(true);
  // const [limit, setLimit] = useState(30);

  const scrollContainerRef = useRef(null);

  // Xử lý tự cuộn xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [currentConversation, isLoading, isIncreaseSize]);

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
        // limit,
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
  const sendMessage = async ({ message }) => {
    try {
      setIsLoading(true);
      socket?.emit("send_question_rasa_chatbot", {
        from: user?._id,
        to: process.env.REACT_APP_ADMIN_ID,
        message,
        conversationId: currentConversation?._id,
      });

      // Gọi request đến rasa server
      const response = await sendQuestionApi({
        data: { sender: "Dat", message },
      });

      // Nếu có rasa phản hồi thì tiến hành gửi socket lưu vào DB
      if (response) {
        socket?.emit("send_question_rasa_chatbot", {
          from: process.env.REACT_APP_ADMIN_ID,
          to: user?._id,
          conversationId: currentConversation?._id,
          message: response[0]?.text || response[0]?.custom?.text,
          buttons: response[0]?.buttons,
          employers: response[0]?.custom?.employers,
          image: response[1]?.image,
          charts: response[0]?.custom?.charts,
          jobs: response[0]?.custom?.jobs,
        });
        setIsLoading(false);
        setIsAppearMesage(false);
      }
    } catch (error) {
      setIsLoading(true);
    }
  };

  // Hàm xử lý gửi message
  const handleSendMessage = async () => {
    setIsAppearMesage(true);
    if (!inputMessage) return;

    setInputMessage("");

    sendMessage({ message: inputMessage });
  };
  // Hàm xử lý gửi message khi nhấn phím Enter
  const handleEnterMessage = async (e) => {
    setIsAppearMesage(true);
    if (e.key === "Enter") {
      if (!inputMessage) return;

      setInputMessage("");
      sendMessage({ message: inputMessage });
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

  const handleClickButtonsMessage = ({ message }) => {
    if (!message) return;

    sendMessage({ message });
  };

  return (
    <div
      className={`fixed bottom-5 right-5 shadow-blue-gray-900 shadow-2xl z-40 rounded-xl overflow-hidden border border-gray-400 transition-all ${
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
            <Typography className="text-lg font-bold text-teal-700">
              Intelligence IT Job Finding Chatbot
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="hover:text-white hover:bg-blue-gray-300 p-1 rounded-full transition-all"
            onClick={() => handleCloseBoxChat()}
          >
            <icons.IoRemove size={24} />
          </button>
          <button
            className="hover:text-white hover:bg-blue-gray-300 p-2 rounded-full transition-all"
            onClick={() => handleIncreaseSize()}
          >
            <icons.BsArrowsFullscreen size={16} />
          </button>
        </div>
      </div>
      <div
        className={`${
          isIncreaseSize
            ? "h-[calc(100vh-100px-120px)]"
            : "h-[calc(550px-120px)]"
        } transition-all flex flex-col gap-2 w-full overflow-y-auto p-3 bg-gradient-to-r from-[#cbd5e1] to-[#f1f5f9]`}
        ref={scrollContainerRef}
      >
        {currentConversation &&
          currentConversation.messageIds &&
          currentConversation.messageIds.length > 0 &&
          currentConversation.messageIds.map((message) => {
            return (
              <Message
                message={message}
                key={message?._id}
                onClickRecommentQuestion={handleClickButtonsMessage}
                isLoading={isLoading}
              />
            );
          })}
        {isLoading && (
          <div className="flex gap-2 w-full">
            <Avatar
              src={images.chatbotavatar}
              alt=""
              className="h-10 w-10 bg-blue-gray-700 p-1"
            />
            <div className="w-20 rounded-bl-xl rounded-br-xl rounded-tr-xl flex items-center justify-center  bg-white">
              <div class="loader"></div>
            </div>
          </div>
        )}
      </div>
      <div className="h-[60px] p-2 flex items-center gap-2 bg-white">
        <div className="flex items-center gap-2 ">
          <label
            className="text-blue-500 active:text-blue-700 cursor-pointer"
            htmlFor="attachCV"
          >
            <icons.IoAttach size={24} />
          </label>
          <input id="attachCV" type="file" hidden />
          <button className="text-blue-500 active:text-blue-700">
            <icons.IoMicSharp size={24} />
          </button>
        </div>
        <input
          className="outline-none border-none flex-1 bg-blue-gray-100 rounded-full p-[10px] px-4 placeholder:text-gray-600 text-sm font-bold"
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
