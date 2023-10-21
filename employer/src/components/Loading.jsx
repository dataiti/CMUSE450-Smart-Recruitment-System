import React from "react";
import { Spinner } from "@material-tailwind/react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center  bg-blue-gray-900 bg-opacity-75 transition-opacity h-screen fixed inset-0 z-50">
      <Spinner className="h-12 w-12" color="blue" />
    </div>
  );
};

export default Loading;
