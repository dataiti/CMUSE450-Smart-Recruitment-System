import { Spinner } from "@material-tailwind/react";
import React from "react";

const TrainLoading = () => {
  return (
    <div className="relative inset-0 h-screen w-screen z-50">
      <div className="absolute right-6 bottom-6 p-20  transition-opacity h-screen">
        dasdas
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    </div>
  );
};

export default TrainLoading;
