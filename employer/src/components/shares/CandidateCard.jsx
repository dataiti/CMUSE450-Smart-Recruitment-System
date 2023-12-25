import React from "react";
import ProgressCustom from "./ProgressCustom";
import { Avatar, Typography } from "@material-tailwind/react";
import ButtonCustom from "./ButtonCustom";
import CirculeProgress from "./CirculeProgress";

const CandidateCard = ({ data = {} }) => {
  return (
    <div
      className={`flex flex-col gap-2 px-3 pb-3 rounded-md bg-white transition-all hover:-translate-y-1 cursor-pointer ${
        data?.isPassed
          ? "border-l-[6px] border-green-500"
          : "border-l-[6px] border-red-500 "
      }`}
    >
      <ProgressCustom value={data?.totalScore} />
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar
            src={data?.userId?.avatar}
            alt=""
            className="h-16 w-16 p-1 bg-blue-gray-100 flex-none"
          />
          <div className="absolute top-1 -right-1 w-4 h-4 bg-green-400 border border-white rounded-full"></div>
        </div>
        <div className="flex flex-col">
          <Typography className="text-sm font-bold">
            {data?.userId?.lastName} {data?.userId?.firstName}
          </Typography>
          <Typography className="text-xs font-semibold text-gray-700">
            {data?.userId?.email}
          </Typography>
          <Typography className="text-xs font-semibold text-gray-700">
            Kinh nghiệm: {data?.experience}
          </Typography>
          <Typography className="text-xs font-semibold text-gray-700">
            Luong mong muôn: {data?.desiredSalary}
          </Typography>
          <button className="text-xs font-semibold text-blue-500 hover:underline">
            Xem thêm
          </button>
        </div>
      </div>
      {/* <div className="flex flex-col gap-1 text-xs font-bold">
        <div className="flex items-center gap-1 flex-wrap">
          {data?.skills?.slice(0, 3)?.map((skill, index) => {
            return (
              <div
                className="text-blue-700 bg-blue-50 name flex whitespace-nowrap items-center gap-2 px-4 py-1 rounded-md"
                key={index}
              >
                <Typography className="text-xs font-bold">{skill}</Typography>
              </div>
            );
          })}
          <div>...</div>
        </div>
      </div> */}
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <ButtonCustom>Liên hệ</ButtonCustom>
          <ButtonCustom to={data?.CVpdf} isBlank>
            Xem CV
          </ButtonCustom>
        </div>
        <CirculeProgress
          className="h-[45px] w-[45px]"
          percentage={data?.totalScore}
        />
      </div>
    </div>
  );
};

export default CandidateCard;
