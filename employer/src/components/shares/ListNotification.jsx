import React, { useEffect } from "react";
import { socket } from "../../socket";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";

const ListNotification = () => {
  const { isLoggedIn, user, refreshToken } = useSelector(authSelect);

  useEffect(() => {
    socket?.emit("get_list_notifications", { userId: user?._id });
  }, []);

  return <div>ListNotification</div>;
};

export default ListNotification;
