import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { useSelector } from "react-redux";

import { socket, connectSocket } from "./socket";
import routers from "./routes";
import { authSelect } from "./redux/features/slices/authSlice";

const App = () => {
  const routing = useRoutes(routers);
  const { user, isLoggedIn } = useSelector(authSelect);

  useEffect(() => {
    if (isLoggedIn) {
      connectSocket({ userId: user?._id });
    }

    return () => {
      socket?.disconnect();
    };
  }, [user, isLoggedIn]);

  return <div className="app">{routing}</div>;
};

export default App;
