import React from "react";
import { Drawer } from "@material-tailwind/react";

const DrawerCustom = ({ open, closeDrawer, children }) => {
  return (
    <Drawer
      open={open}
      onClose={closeDrawer}
      size={600}
      placement="right"
      transition={{ type: "spring", duration: 0.5 }}
      overlay={false}
      className="h-screen overflow-y-hidden hover:overflow-y-scroll p-8 !shadow-2xl"
    >
      {children}
    </Drawer>
  );
};

export default DrawerCustom;
