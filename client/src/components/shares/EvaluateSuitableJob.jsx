import React from "react";
import { RadarChart } from "../charts";
import { DialogBody, DialogHeader, Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { CirculeProgress, Tag, ProgressCustom } from "../shares";
import { authSelect } from "../../redux/features/slices/authSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const EvaluateSuitableJob = ({ setOpen = () => {}, data = {} }) => {
  const { user } = useSelector(authSelect);

  return (
    <div className="h-full rounded-md !text-black bg-blue-gray-900">
      <DialogHeader>
        <div className="flex items-center justify-between w-full">
          <Typography className="uppercase text-sm font-bold text-light-blue-600">
            Đánh giá mức độ phù hợp công việc
          </Typography>
          {!user?.candidateId && (
            <Typography className="text-red-500 text-sm font-bold">
              Vui lòng đăng ký ứng cử viên để xem đánh giá.{" "}
              <Link className="text-blue-500 underline" to="/candidate">
                Đánh giá ngay
              </Link>
            </Typography>
          )}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 justify-between border border-gray-100 rounded-md flex-1 p-2">
                    <Typography className="text-center text-sm font-bold text-light-blue-600">
                      Đánh giá mức độ phù hợp
                    </Typography>
                    <div className="flex items-center justify-center">
                      <CirculeProgress
                        percentage={data?.data?.overallPercentage}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 justify-between border border-gray-100 rounded-md flex-1 p-2">
                    <Typography className="text-center text-sm font-bold text-light-blue-600">
                      Độ lệch chuẩn
                    </Typography>
                    <div className="flex items-center justify-center">
                      <Typography className="border-[8px] border-light-blue-500 flex items-center justify-center h-[60px] w-[60px] bg-light-blue-50 text-light-blue-500 font-bold rounded-full text-lg">
                        {data?.data?.standardDeviation}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="h-full flex flex-col justify-center gap-3 p-3 border border-gray-100 rounded-md">
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
