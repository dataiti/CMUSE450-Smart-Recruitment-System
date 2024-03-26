import React from "react";
import PropTypes from "prop-types";
import { TypographyCustom } from "../shares";

const HeaderChatbot = ({ title = "", className = "" }) => {
  return (
    <div
      className={`bg-white h-[60px] w-full flex items-center px-8 border-b border-blue-gray-100 ${className}`}
    >
      <TypographyCustom className="font-bold" text={title} />
    </div>
  );
};

PropTypes.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
};

export default HeaderChatbot;
