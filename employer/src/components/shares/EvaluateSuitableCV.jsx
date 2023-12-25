import React from "react";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { CirculeProgress, ProgressCustom, Tag } from "../shares";

const EvaluateSuitableCV = ({ applyJobData = {} }) => {
  return (
    <div className="bg-blue-gray-900 p-3 rounded-md flex flex-col gap-2">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col border border-gray-100 rounded-md p-4">
          <Typography className="text-sm font-bold text-light-blue-600">
            Đánh giá mức độ phù hợp
          </Typography>
          <div className="w-full flex items-center gap-5">
            <div className="flex-none mt-6">
              <CirculeProgress
                percentage={applyJobData?.data?.overallPercentage}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <ProgressCustom
                label="Kinh nghiệm"
                value={applyJobData?.data?.experiencePercentage}
              />
              <ProgressCustom
                label="Kỹ năng"
                value={applyJobData?.data?.skillsPercent}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 border border-gray-100 rounded-md p-4">
        <div className="flex flex-col gap-2 flex-wrap">
          <Typography className="text-sm font-bold text-light-blue-600">
            Kỹ năng bạn phù hợp
          </Typography>
          <div className="flex items-center gap-2">
            {applyJobData?.data?.skillMatch?.map((skill, index) => (
              <Tag
                key={index}
                className="text-green-500 bg-green-50 rounded-md !px-6 !py-2 !text-base"
                icon={<icons.BsFillCheckCircleFill />}
              >
                {skill}
              </Tag>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-wrap">
          <Typography className="text-sm font-bold text-light-blue-600">
            Kỹ năng bạn còn thiếu
          </Typography>
          <div className="flex items-center gap-2 flex-wrap">
            {applyJobData?.data?.skillNotMatch?.map((skill, index) => (
              <Tag
                key={index}
                className="text-red-500 bg-red-50 rounded-md !px-6 !py-2 !text-base"
                icon={<icons.IoCloseCircleSharp />}
              >
                {skill}
              </Tag>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Typography className="text-sm font-bold text-light-blue-600">
            Kỹ năng trong CV
          </Typography>
          <div className="flex items-center gap-2 flex-wrap">
            {applyJobData?.data?.cvSkills?.map((skill, index) => (
              <Tag
                key={index}
                className="text-blue-500 bg-blue-50 rounded-md !px-6 !py-2 !text-base"
                icon={<icons.BsFillCheckCircleFill />}
              >
                {skill}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluateSuitableCV;
