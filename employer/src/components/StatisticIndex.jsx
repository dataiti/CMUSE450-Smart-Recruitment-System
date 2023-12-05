import React from "react";
import { Typography } from "@material-tailwind/react";

const StatisticIndex = ({ title, icon, index }) => {
  return (
    <div className="bg-white shadow-sm p-4 rounded-md h-28 flex flex-col gap-2 items-center">
      <Typography className="uppercase text-sm flex items-center gap-2 font-extrabold text-green-900">
        {icon}
        {title}
      </Typography>
      <div className="bg-[#ede9fe] w-16 h-16 rounded-lg flex items-center justify-center">
        <Typography className="text-3xl font-extrabold text-[#5b21b6]">
          {index}
        </Typography>
      </div>
    </div>
  );
};

export default StatisticIndex;
