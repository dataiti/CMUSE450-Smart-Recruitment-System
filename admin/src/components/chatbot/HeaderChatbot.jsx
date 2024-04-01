import React from "react";
import PropTypes from "prop-types";

import { TypographyCustom } from "../shares";

const HeaderChatbot = ({ title = "" }) => {
  return (
    <div className="bg-white h-[60px] w-full flex items-center px-8 border-b border-blue-gray-100">
      <TypographyCustom className="font-bold" text={title} />
    </div>
  );
};

HeaderChatbot.propTypes = {
  title: PropTypes.string,
};

export default HeaderChatbot;
