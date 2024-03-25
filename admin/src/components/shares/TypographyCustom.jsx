import { Typography } from "@material-tailwind/react";
import React from "react";

const TypographyCustom = ({ text = "", className = "" }) => {
  return (
    <Typography className={`text-sm font-bold text-black ${className}`}>
      {text}
    </Typography>
  );
};

export default TypographyCustom;
