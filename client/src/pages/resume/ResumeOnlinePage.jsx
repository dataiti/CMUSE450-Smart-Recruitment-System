import React, { useEffect, useRef, useState } from "react";
import { Spinner, Typography } from "@material-tailwind/react";
import { useReactToPrint } from "react-to-print";
import { menuCVItems } from "../../utils/constants";
import IconButtonCustom from "../../components/IconButtonCustom";
import { icons } from "../../utils/icons";
import { toast } from "react-toastify";
import { images } from "../../assets/images";
import { Link } from "react-router-dom";
import { socket } from "../../socket";
import Markdown from "markdown-to-jsx";
import IconicCV from "../../components/IconicCV";

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

  const handleSetContentMenu = (type) => {
    if (type === "template") {
      setTypeMenu(type);
      setContentMenu(images.listCVTemplateImage);
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
                  onClick={() => handleSetContentMenu(item.type)}
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
        <div className="w-[12%] bg-blue-gray-800">
          {typeMenu === "template" ? (
            <div className="flex flex-col gap-3 px-5 py-10">
              {contentMenu.map((content, index) => {
                return (
                  <div key={index} className="rounded-md shadow-lg">
                    <img
                      src={content}
                      alt=""
                      className="rounded-md cursor-pointer hover:border-2 border-teal-700 transition-all"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="w-[55%] h-full flex justify-center overflow-y-auto">
          <div className="h-full w-full bg-white py-8 px-16" ref={conponentPDF}>
            <IconicCV />
          </div>
        </div>
        <div className="w-[36%] p-4 bg-blue-gray-900 flex flex-col gap-5">
          <Typography className="uppercase font-bold text-white">
            Chat bot
          </Typography>
          <div className="h-full w-full rounded-md overflow-y-auto text-white">
            {question && (
              <div className="flex justify-end">
                <Typography className=" bg-teal-700 rounded-xl p-3 font-bold text-sm max-w-[80%]">
                  {question}
                </Typography>
              </div>
            )}
            <div className="flex justify-center">
              {isLoading && <Spinner className="h-8 w-8" />}
            </div>
            {answer && (
              <div className="flex justify-start bg-blue-gray-800 p-3 rounded-xl mt-2">
                <Markdown
                  options={{
                    wrapper: "aside",
                    forceWrapper: true,
                  }}
                >
                  {answer}
                </Markdown>
              </div>
            )}
          </div>
          <input
            className="outline-none border-none px-4 py-3 rounded-full bg-blue-gray-800 text-white"
            value={inputMessageValue}
            onChange={(e) => setInputMessageValue(e.target.value)}
            onKeyDown={handleSendMessageChatbot}
            placeholder="Nhập câu hỏi"
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeOnlinePage;
