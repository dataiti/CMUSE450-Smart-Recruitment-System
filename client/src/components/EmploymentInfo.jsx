import { IconButton, Typography } from "@material-tailwind/react";
import React from "react";

const EmploymentInfo = ({ title, children, className, icon }) => {
  return (
    <div className="flex items-center gap-2">
      <IconButton className="rounded-full bg-[#fde68a]">{icon}</IconButton>
      <div className="flex flex-col gap-2">
        <Typography className="font-bold">{title}</Typography>
        <Typography className="text-xs">{children}</Typography>
      </div>
    </div>
  );
};

export default EmploymentInfo;
