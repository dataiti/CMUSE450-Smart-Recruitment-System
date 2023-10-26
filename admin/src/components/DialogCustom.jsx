import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import React from "react";

const DialogCustom = ({
  open,
  handleOpen,
  headerContent = "",
  bodyContent = "",
}) => {
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader>{headerContent}</DialogHeader>
      <DialogBody divider>{bodyContent}</DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          <span>Huỷ</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleOpen}>
          <span>Xác nhận</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DialogCustom;
