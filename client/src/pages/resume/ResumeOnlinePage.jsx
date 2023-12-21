import React, { useEffect, useRef, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { useReactToPrint } from "react-to-print";
import { colors, menuCVItems } from "../../utils/constants";
import { IconButtonCustom } from "../../components/shares";
import { icons } from "../../utils/icons";
import { toast } from "react-toastify";
import { images } from "../../assets/images";
import { Link } from "react-router-dom";
import { socket } from "../../socket";
import { Chatbot } from "../../components/shares";
import Iconic from "../../components/CVs/templates/Iconic";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";

const ResumeOnlinePage = () => {
  const { user } = useSelector(authSelect);

  const [inputMessageValue, setInputMessageValue] = useState("");
  const [color, setColor] = useState({
    backgound: "bg-green-500",
    color: "text-green-500",
  });
  const [chatbotCoversation, setChatbotCoversation] = useState([]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contentMenu, setContentMenu] = useState(
    () => images.listCVTemplateImage
  );
  const [typeMenu, setTypeMenu] = useState("template");

  const conponentPDF = useRef();

  useEffect(() => {
    if (typeMenu === "template") {
      setContentMenu(images.listCVTemplateImage);
    } else if (typeMenu === "color") {
      setContentMenu(colors);
    }
  }, [typeMenu]);

  useEffect(() => {
    socket?.emit("chatbot_conversation", { userId: user?._id });

    const handleUserGetAnswer = (message) => {
      setIsLoading(true);
      if (message.success) {
        setChatbotCoversation(message.message);
        setIsLoading(false);
      }
    };

    socket?.on("get_chatbot_conversation", handleUserGetAnswer);

    return () => {
      socket?.off("get_chatbot_conversation", handleUserGetAnswer);
    };
  }, [user?._id]);

  const handleSendMessageChatbot = async (e) => {
    if (e.key === "Enter") {
      setIsLoading(true);
      setQuestion(inputMessageValue);
      setInputMessageValue("");
      socket.emit("send_question", {
        userId: user?._id,
        prompt: inputMessageValue,
      });
    }
  };

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Userdata",
    onAfterPrint: () => toast.success("Đã lưu !"),
  });

  return (
    <div className="h-screen bg-white">
      <div className="flex h-full">
        <div className="w-[70px] h-full bg-blue-gray-900 ">
          <div className="flex flex-col items-center gap-7 py-5">
            <Link to="/">
              <img
                className="h-14 w-14 rounded-lg object-cover"
                src={images.logo}
                alt=""
              />
            </Link>
            {menuCVItems.map((item) => {
              return (
                <div
                  className="flex flex-col gap-2 items-center"
                  key={item.id}
                  onClick={() => setTypeMenu(item.type)}
                >
                  <IconButtonCustom className="!rounded-lg bg-white text-light-blue-600">
                    {item.icon}
                  </IconButtonCustom>
                  <Typography className="text-white text-xs font-bold">
                    {item.name}
                  </Typography>
                </div>
              );
            })}
            <div
              className="flex flex-col gap-2 items-center"
              onClick={() => generatePDF()}
            >
              <IconButtonCustom className="!rounded-lg bg-white text-light-blue-600">
                <icons.BsFileEarmarkArrowDownFill size={20} />
              </IconButtonCustom>
              <Typography className="text-white text-xs font-bold">
                Tải xuống
              </Typography>
            </div>
          </div>
        </div>
        <div className="w-[12%] bg-blue-gray-800 h-screen overflow-y-auto">
          <div className="flex flex-col gap-3 px-5 py-10">
            {contentMenu.map((content, index) => {
              return (
                <div key={index} className="rounded-md shadow-lg">
                  {typeMenu === "template" ? (
                    <img
                      src={content.value}
                      alt=""
                      className="rounded-md cursor-pointer hover:border-2 border-teal-700 transition-all"
                    />
                  ) : (
                    <div
                      className={`h-10 w-full rounded-md ${content.backgound} cursor-pointer`}
                      onClick={() =>
                        setColor({
                          backgound: content.backgound,
                          color: content.color,
                        })
                      }
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[52%] h-full flex justify-center overflow-y-auto p-4">
          <div className="h-full w-full bg-white py-8 px-16" ref={conponentPDF}>
            <Iconic color={color} />
          </div>
        </div>
        <div className="w-[36%] h-screen">
          <Chatbot
            chatbotCoversation={chatbotCoversation}
            question={question}
            isLoading={isLoading}
            setInputMessageValue={setInputMessageValue}
            inputMessageValue={inputMessageValue}
            handleSendMessageChatbot={handleSendMessageChatbot}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeOnlinePage;
