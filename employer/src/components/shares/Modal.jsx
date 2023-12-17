import React from "react";
import { Dialog } from "@material-tailwind/react";

const Modal = ({ children, open, handleOpen, size = "lg" }) => {
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.8, y: -100 },
      }}
      className="!z-40"
      size={size}
    >
      {children}
    </Dialog>
  );
};

export default Modal;
