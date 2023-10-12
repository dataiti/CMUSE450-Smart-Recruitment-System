import React, { useState } from "react";
import HeaderEditCV from "../../components/HeaderEditCV";
import { Button } from "@material-tailwind/react";

const ResumeOnlinePage = () => {
  const [sizePaper, setSizePaper] = useState();

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className=" grid grid-cols-12">
        <div className="col-span-8 h-full ">
          <HeaderEditCV />
          <div className="h-[calc(100vh-130px)] bg-[#313131] overflow-y-auto">
            <div className="flex items-center justify-center flex-col gap-5 my-10">
              <div className="h-[1096px] w-[775px] bg-white"></div>
              <div className="h-[1096px] w-[775px] bg-white"></div>
            </div>
          </div>
        </div>
        <div className="h-full col-span-4 bg-[#3D3D3D]">Chat</div>
      </div>
    </div>
  );
};

export default ResumeOnlinePage;
