import React from "react";
import { Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";

const TypographyCustom = ({ text = "", className = "" }) => {
  return (
    <Typography className={`text-sm font-bold text-black ${className}`}>
      {text}
    </Typography>
  );
};

TypographyCustom.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};

export default TypographyCustom;
