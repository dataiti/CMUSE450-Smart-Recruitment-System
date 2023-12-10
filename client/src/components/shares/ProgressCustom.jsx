import { Progress, Typography } from "@material-tailwind/react";
import React from "react";

const ProgressCustom = ({ label = "", value = 0 }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <Typography className="text-sm font-bold text-light-blue-600">
          {label}
        </Typography>
        <Typography className="text-sm font-bold text-light-blue-600">
          {value} %
        </Typography>
      </div>
      <Progress value={value} size="md" color="teal" />
    </div>
  );
};

export default ProgressCustom;
