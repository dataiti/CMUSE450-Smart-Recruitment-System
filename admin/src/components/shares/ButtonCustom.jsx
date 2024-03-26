import React from "react";
import PropTypes from "prop-types";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const ButtonCustom = ({
  type = "",
  to = "",
  leftIcon,
  isDisable = false,
  isBlank = false,
  isRounded = false,
  children,
  className = "",
  ...props
}) => {
  if (isDisable) {
    Object.keys(props).forEach((key) => {
      if (key.startsWith("on") && typeof props[key] === "function") {
        delete props[key];
      }
    });
  }

  const buttonProps = {
    disabled: isDisable,
    className: `capitalize shadow-none active:shadow-none hover:shadow-none flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-all 
       ${isRounded && "!rounded-full"} ${className}`,
    ...props,
  };

  return (
    <>
      {to ? (
        <Link to={to} target={isBlank ? "_blank" : ""}>
          <Button {...buttonProps}>
            {leftIcon && <span>{leftIcon}</span>}
            <span className="text-xs font-bold">{children}</span>
          </Button>
        </Link>
      ) : (
        <Button {...buttonProps}>
          {leftIcon && <span>{leftIcon}</span>}
          <span className="text-xs font-bold">{children}</span>
        </Button>
      )}
    </>
  );
};

ButtonCustom.propTypes = {
  type: PropTypes.string,
  to: PropTypes.string,
  className: PropTypes.string,
  isDisable: PropTypes.bool,
  isBlank: PropTypes.bool,
  isRounded: PropTypes.bool,
  leftIcon: PropTypes.node,
  children: PropTypes.node,
};

export default ButtonCustom;
