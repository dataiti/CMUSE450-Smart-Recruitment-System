import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import React from "react";

const ButtonCustom = ({
  children,
  icon,
  className,
  variant = "filled",
  onClick,
  fullWidth = false,
  type,
  to = "",
  isblank = false,
}) => {
  return (
    <>
      {!to ? (
        <Button
          type={type}
          variant={variant}
          className={`capitalize shadow-none active:shadow-none flex items-center justify-center gap-2  bg-[#0891b2] cursor-pointer hover:bg-[#06b6d4] active:bg-[#06b6d4] ${className}`}
          onClick={onClick}
          fullWidth={fullWidth}
        >
          {children}
        </Button>
      ) : (
        <Link to={to} target={isblank ? "_blank" : null}>
          <Button
            type={type}
            variant={variant}
            className={`capitalize shadow-none active:shadow-none flex items-center justify-center gap-2  bg-[#0891b2] cursor-pointer hover:bg-[#06b6d4] active:bg-[#06b6d4] ${className}`}
            onClick={onClick}
            fullWidth={fullWidth}
          >
            {children}
          </Button>
        </Link>
      )}
    </>
  );
};

export default ButtonCustom;
