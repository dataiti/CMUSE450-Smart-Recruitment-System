import React from "react";
import ProgressCustom from "./ProgressCustom";
import { Avatar, Typography } from "@material-tailwind/react";
import ButtonCustom from "./ButtonCustom";
import CirculeProgress from "./CirculeProgress";

const CandidateCard = () => {
  return (
    <div className="flex flex-col gap-2 px-3 pb-3 bg-white rounded-md">
      <ProgressCustom value={40} />
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar
            src="https://cdn.dribbble.com/users/200587/screenshots/16445828/media/679270c091122b0718c06dc92eecf38b.png?resize=400x300&vertical=center"
            alt=""
            className="h-16 w-16 p-1 bg-blue-gray-100"
          />
          <div className="absolute top-1 -right-1 w-4 h-4 bg-green-400 border border-white rounded-full"></div>
        </div>
        <div className="flex flex-col">
          <Typography className="text-sm font-bold">Thanh Dat</Typography>
          <Typography className="text-xs font-semibold text-gray-500">
            nguyendat@gmail.com
          </Typography>
          <Typography className="text-xs font-semibold text-gray-500">
            Kinh nghiệm: 3
          </Typography>
          <Typography className="text-xs font-semibold text-gray-500">
            Luong mong muôn: 312301203
          </Typography>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-xs font-bold">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-blue-700 bg-blue-50 name flex whitespace-nowrap items-center gap-2 px-4 py-1 rounded-md">
            <Typography className="text-xs font-bold">java</Typography>
          </div>
          <div className="text-blue-700 bg-blue-50 name flex whitespace-nowrap items-center gap-2 px-4 py-1 rounded-md">
            <Typography className="text-xs font-bold">java</Typography>
          </div>
          <div className="text-blue-700 bg-blue-50 name flex whitespace-nowrap items-center gap-2 px-4 py-1 rounded-md">
            <Typography className="text-xs font-bold">java</Typography>
          </div>
          <div className="text-blue-700 bg-blue-50 name flex whitespace-nowrap items-center gap-2 px-4 py-1 rounded-md">
            <Typography className="text-xs font-bold">java</Typography>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <ButtonCustom>Liên hệ</ButtonCustom>
          <ButtonCustom>Xem CV</ButtonCustom>
        </div>
        <CirculeProgress className="h-[40px] w-[40px]" />
      </div>
    </div>
  );
};

export default CandidateCard;
