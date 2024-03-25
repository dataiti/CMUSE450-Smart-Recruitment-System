import { useRoutes } from "react-router-dom";
import routers from "./routes";
import React, { useState } from "react";
import { useEffect } from "react";
import { authSelect } from "./redux/features/slices/authSlice";
import { useSelector } from "react-redux";
import { connectSocket, socket } from "./socket";
import { RasaBoxChat } from "./components/chatbot";
import { Avatar } from "@material-tailwind/react";
import { images } from "./assets/images";

const App = () => {
  const routing = useRoutes(routers);
  const { user, isLoggedIn } = useSelector(authSelect);

  const [isBoxChatOpen, setIsBoxChatOpen] = useState(false);
  const [isBoxChatBubble, setIsBoxChatBubble] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      connectSocket({ userId: user?._id });
    }

    return () => {
      socket?.disconnect();
    };
  }, [user?._id, isLoggedIn]);

  return (
    <div className="app">
      <div>{routing}</div>
      {isBoxChatOpen && (
        <RasaBoxChat
          isBoxChatOpen={isBoxChatOpen}
          setIsBoxChatOpen={setIsBoxChatOpen}
          setIsBoxChatBubble={setIsBoxChatBubble}
          isBoxChatBubble={isBoxChatBubble}
        />
      )}
      {isBoxChatBubble && (
        <button
          className="h-16 w-16 flex items-center justify-center rounded-full bg-[#212f3f] text-light-blue-600 fixed bottom-5 right-5 shadow-2xl z-40"
          onClick={() => {
            setIsBoxChatBubble(false);
            setIsBoxChatOpen(true);
          }}
        >
          <Avatar src={images.chatbotavatar} className="p-2 h-14 w-14" />
        </button>
      )}
    </div>
  );
};

export default App;
