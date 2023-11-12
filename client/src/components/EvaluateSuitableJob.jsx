import React from "react";
import RadarChart from "./RadarChart";
import { DialogBody, DialogHeader, Typography } from "@material-tailwind/react";
import ProgressCustom from "./ProgressCustom";
import { icons } from "../utils/icons";
import Tag from "./Tag";

const EvaluateSuitableJob = ({ setOpen = () => {}, data = {} }) => {
  return (
    <div className=" h-full rounded-md !text-black bg-blue-gray-900">
      <DialogHeader>
        <div className="flex items-center justify-between w-full">
          <Typography className="uppercase text-sm font-bold text-light-blue-600">
            Đánh giá mức độ phù hợp công việc
          </Typography>
          <span
            className="text-teal-600 hover:opacity-90 cursor-pointer transition-all"
            onClick={() => setOpen(false)}
          >
            <icons.AiFillCloseCircle size={30} />
          </span>
        </div>
      </DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="border border-gray-100 rounded-md flex-1 p-4">
                  <Typography className="text-sm font-bold text-light-blue-600">
                    Đánh giá mức độ phù hợp
                  </Typography>
                </div>
                <div className="flex flex-col gap-4 p-4 border border-gray-100 rounded-md">
                  {data?.data?.percentages?.map((percentage, index) => {
                    return (
                      <ProgressCustom
                        key={index}
                        label={percentage?.title}
                        value={percentage?.value}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="h-[400px] border border-gray-100 rounded-md flex items-center justify-center">
                <RadarChart data={data?.data?.percentages} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Typography className="text-sm font-bold text-light-blue-600">
                Kỹ năng bạn phù hợp
              </Typography>
              <div className="flex items-center gap-2">
                {data?.data?.skillMatch.map((skill, index) => (
                  <Tag
                    key={index}
                    className="text-green-500 bg-indigo-50 rounded-md !px-6 !py-2 !text-base"
                    icon={<icons.BsFillCheckCircleFill />}
                  >
                    {skill}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Typography className="text-sm font-bold text-light-blue-600">
                Kỹ năng bạn còn thiếu
              </Typography>
              <div className="flex items-center gap-2">
                {data?.data?.skillNotMatch.map((skill, index) => (
                  <Tag
                    key={index}
                    className="text-red-500 bg-indigo-50 rounded-md !px-6 !py-2 !text-base"
                    icon={<icons.IoCloseCircleSharp />}
                  >
                    {skill}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogBody>
    </div>
  );
};

export default EvaluateSuitableJob;
