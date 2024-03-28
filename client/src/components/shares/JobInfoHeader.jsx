import React from "react";
import { IconButtonCustom, TypographyCustom } from "../shares";

const JobInfoHeader = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-2 text-teal-800">
      <IconButtonCustom>{icon}</IconButtonCustom>
      <TypographyCustom text={text} className="text-teal-800 text-base" />
    </div>
  );
};

export default JobInfoHeader;
