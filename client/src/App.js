import { useRoutes } from "react-router-dom";
import routers from "./routes";
import React from "react";

const App = () => {
  const routing = useRoutes(routers);

  return <div className="app">{routing}</div>;
};

export default App;
