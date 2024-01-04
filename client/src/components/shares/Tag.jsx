import { Typography } from "@material-tailwind/react";
import React from "react";

const Tag = ({ children, icon, className }) => {
  return (
    <div
      className={`flex items-center flex-wrap gap-1 px-4 py-1 rounded-full ${className}`}
    >
      {icon && icon}
      <Typography className="!text-[10px] font-bold  whitespace-nowrap">
        {children}
      </Typography>
    </div>
  );
};

export default Tag;
