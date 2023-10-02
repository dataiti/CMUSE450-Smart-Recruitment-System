import { Button, Drawer } from "@material-tailwind/react";
import React from "react";

const UserProfilePage = () => {
  const [open, setOpen] = React.useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  return (
    <div>
      <Button onClick={openDrawer}>Open Drawer</Button>
      <Drawer
        boolean={false}
        placement="right"
        open={open}
        onClose={closeDrawer}
        className="p-4"
        transition={{ type: "spring", duration: 0.5 }}
      ></Drawer>
    </div>
  );
};

export default UserProfilePage;
