import React from "react";
import { ZoomMeeting } from "../../components/shares";

const DecorationPage = () => {
  return (
    <div className="w-full flex">
      <div className="h-full w-full"></div>
      <div className="h-[calc(100vh-60px)] overscroll-y-auto w-[480px] bg-white border-l border-blue-gray-100">
        <ZoomMeeting />
      </div>
    </div>
  );
};

export default DecorationPage;
