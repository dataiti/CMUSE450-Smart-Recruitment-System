import { useRoutes } from "react-router-dom";
import routers from "./routes";
import React from "react";
import { useEffect } from "react";
import { authSelect } from "./redux/features/slices/authSlice";
import { useSelector } from "react-redux";
import { connectSocket, socket } from "./socket";

const App = () => {
  const routing = useRoutes(routers);
  const { user, isLoggedIn } = useSelector(authSelect);

  useEffect(() => {
    if (isLoggedIn) {
      connectSocket({ employerId: user?.ownerEmployerId?._id });
    }

    return () => {
      socket?.disconnect();
    };
  }, [user?.ownerEmployerId?._id, isLoggedIn]);

  return <div className="app">{routing}</div>;
};

export default App;
