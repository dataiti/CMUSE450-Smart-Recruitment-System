import React from "react";

import {
  MessageType,
  InvitedType,
  SystemType,
} from "../shares/TypeNotification";
import { Typography, Spinner } from "@material-tailwind/react";

const ListNotification = ({
  listNotifications = [],
  isLoading = false,
  setOpenModal,
  setListNotifications,
}) => {
  return (
    <div className="absolute bg-white p-2 shadow-2xl rounded-md top-[120%] left-[50%] -translate-x-[50%] col-span-4 flex flex-col gap-1 w-[360px] h-[400px] overflow-y-auto">
      {isLoading ? (
        <div className="h-full flex items-center justify-center py-2">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <>
          <Typography className="text-center my-2 text-sm font-bold text-light-blue-500">
            Thông Báo
          </Typography>
          {listNotifications?.map((el, index) => {
            switch (el.type) {
              case "invitation":
                return (
                  <InvitedType
                    el={el}
                    key={index}
                    setOpenModal={setOpenModal}
                    setListNotifications={setListNotifications}
                  />
                );
              case "message":
                return <MessageType el={el} key={index} />;
              default:
                return <SystemType el={el} key={index} />;
            }
          })}
        </>
      )}
    </div>
  );
};

export default ListNotification;
