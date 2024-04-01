import React from "react";
import PropTypes from "prop-types";

import { icons } from "../../utils/icons";

const FooterChatbot = ({
  inputMessage = "",
  setInputMessage,
  onEnterMessage,
  onSendMessage,
}) => {
  return (
    <div className="flex items-center gap-2 px-4 h-[60px] border-t border-blue-gray-100 bg-white">
      <input
        className="w-full outline-none border-none p-3 rounded-md text-sm font-bold text-gray-600 bg-blue-gray-50 placeholder:text-sm placeholder:text-light-blue-500 placeholder:font-bold"
        placeholder="Nhập câu trả lời"
        spellCheck={false}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={onEnterMessage}
      />
      <button
        className="bg-blue-gray-900 text-light-blue-500 p-3 rounded-md"
        onClick={onSendMessage}
      >
        <icons.IoSendSharp size={20} />
      </button>
    </div>
  );
};

FooterChatbot.propTypes = {
  inputMessage: PropTypes.string,
  setInputMessage: PropTypes.func,
  onEnterMessage: PropTypes.func,
  onSendMessage: PropTypes.func,
};

export default FooterChatbot;
