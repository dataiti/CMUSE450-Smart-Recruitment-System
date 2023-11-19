import { IconButton } from "@material-tailwind/react";
import React from "react";

const IconButtonCustom = ({ children, className, onClick }) => {
  return (
    <IconButton
      className={`shadow-none hover:opacity-90 hover:shadow-none rounded-full bg-[#212f3f] text-light-blue-600 ${className}`}
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
};

export default IconButtonCustom;
