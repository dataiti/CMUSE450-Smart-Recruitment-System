import { Button } from "@material-tailwind/react";
import React from "react";

const ButtonCustom = ({
  children,
  icon,
  className,
  variant = "filled",
  onClick,
  fullWidth = false,
  type,
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      className={`capitalize shadow-none active:shadow-none flex items-center justify-center gap-2  bg-[#0891b2] cursor-pointer hover:bg-[#06b6d4] active:bg-[#06b6d4] ${className}`}
      onClick={onClick}
      fullWidth={fullWidth}
    >
      {children}
    </Button>
  );
};

export default ButtonCustom;
