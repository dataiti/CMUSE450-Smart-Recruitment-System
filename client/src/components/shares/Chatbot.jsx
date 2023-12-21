import { Spinner, Typography } from "@material-tailwind/react";
import Markdown from "markdown-to-jsx";
import React from "react";

const Chatbot = ({
  isLoading,
  chatbotCoversation,
  answer,
  inputMessageValue,
  setInputMessageValue,
  handleSendMessageChatbot,
}) => {
  return (
    <div className="w-full h-full p-4 bg-blue-gray-900 flex flex-col gap-5">
      <Typography className="uppercase font-bold text-white">
        Chat bot
      </Typography>
      <div className="h-full w-full overflow-y-auto">
        {chatbotCoversation?.map((conversation) => {
          return (
            <div
              className="h-full w-full rounded-md text-white"
              key={conversation?._id}
            >
              <div className="flex justify-end">
                <Typography className=" bg-teal-700 rounded-xl p-3 font-bold text-sm max-w-[80%]">
                  {conversation?.prompt}
                </Typography>
              </div>
              {/* <div className="flex justify-center ">
                {isLoading && <Spinner className="h-8 w-8" />}
              </div> */}
              <div className="flex justify-start bg-blue-gray-800 p-3 rounded-xl">
                <Markdown
                  options={{
                    wrapper: "aside",
                    forceWrapper: true,
                  }}
                >
                  {conversation?.text}
                </Markdown>
              </div>
            </div>
          );
        })}
      </div>
      <input
        className="outline-none border-none px-4 py-3 rounded-full bg-blue-gray-800 text-white"
        value={inputMessageValue}
        onChange={(e) => setInputMessageValue(e.target.value)}
        onKeyDown={handleSendMessageChatbot}
        placeholder="Nhập câu hỏi"
      />
    </div>
  );
};

export default Chatbot;
