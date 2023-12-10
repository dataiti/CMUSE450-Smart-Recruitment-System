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

const ResumeOnlinePage = () => {
  const [inputMessageValue, setInputMessageValue] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "Hãy gửi một hỏi, tôi sẽ trả lời giúp bạn"
  );
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
    const handleUserGetAnswer = (message) => {
      setIsLoading(true);
      if (message.success) {
        setAnswer(message.message);
        setIsLoading(false);
      }
    };

    socket?.on("get_answer", handleUserGetAnswer);

    return () => {
      socket?.off("get_answer", handleUserGetAnswer);
    };
  }, []);

  const handleSendMessageChatbot = async (e) => {
    if (e.key === "Enter") {
      setIsLoading(true);
      setQuestion(inputMessageValue);
      setAnswer("");
      setInputMessageValue("");
      socket.emit("send_question", {
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
        <div className="w-[14%] bg-blue-gray-800 h-screen overflow-y-auto">
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
                      className={`h-10 w-full rounded-md ${content.value} `}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[52%] h-full flex justify-center overflow-y-auto p-4">
          <div className="h-full w-full bg-white py-8 px-16" ref={conponentPDF}>
            <Iconic />
          </div>
        </div>
        <div className="w-[34%] h-screen">
          <Chatbot
            answer={answer}
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
