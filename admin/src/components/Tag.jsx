import { Typography } from "@material-tailwind/react";
import React from "react";

const Tag = ({ children, icon, className }) => {
  return (
    <div
      className={`flex items-center gap-1 px-4 py-1 rounded-full flex-nowrap ${className}`}
    >
      {icon && icon}
      <Typography className="!text-xs font-bold whitespace-nowrap">
        {children}
      </Typography>
    </div>
  );
};

export default Tag;
