import { IconButton, Typography } from "@material-tailwind/react";
import React from "react";
import { icons } from "../../utils/icons";
import parse from "html-react-parser";

const JobDetailDrawer = ({ jobDetailData = {} }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col bg-white rounded-md ">
        <Typography className="uppercase text-[#212f3f] font-bold text-lg">
          {jobDetailData?.recruitmentTitle}
        </Typography>
        <div className="grid grid-cols-3">
          <div className="flex items-center gap-2">
            <IconButton className="rounded-full bg-[#fde68a]">
              <icons.AiFillDollarCircle size={30} />
            </IconButton>
            <div className="flex flex-col gap-2">
              <Typography className="text-sm">Mức lương</Typography>
              <Typography className="text-xs">
                {jobDetailData?.experience}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconButton className="rounded-full bg-[#fde68a]">
              <icons.HiLocationMarker size={30} />
            </IconButton>
            <div className="flex flex-col gap-2">
              <Typography>Địa điểm</Typography>
              <Typography className="text-xs">
                {jobDetailData?.workRegion?.province}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconButton className="rounded-full bg-[#fde68a]">
              <icons.AiFillClockCircle size={30} />
            </IconButton>
            <div className="flex flex-col gap-2">
              <Typography>Kinh nghiệm</Typography>
              <Typography className="text-xs">
                {jobDetailData?.experience}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-whi rounded-md ">
        <Typography className="border-b-4 border-[#164e63] font-bold uppercase text-sm pb-1">
          Mô tả công việc
        </Typography>
        <div className="text-sm py-2">
          {(jobDetailData.jobDescription &&
            parse(jobDetailData.jobDescription)) ||
            ""}
        </div>
      </div>
      <div className="bg-whi rounded-md ">
        <Typography className="border-b-4 border-[#164e63] font-bold uppercase text-sm pb-1">
          Yêu cầu ứng viên
        </Typography>
        <div className="text-sm py-2">
          {(jobDetailData.candidateRequirements &&
            parse(jobDetailData.candidateRequirements)) ||
            ""}
        </div>
      </div>
      <div className="bg-whi rounded-md ">
        <Typography className="border-b-4 border-[#164e63] font-bold uppercase text-sm pb-1">
          Phúc lợi ứng viên
        </Typography>
        <div className="text-sm py-2">
          {(jobDetailData.candidateBenefits &&
            parse(jobDetailData.candidateBenefits)) ||
            ""}
        </div>
      </div>
    </div>
  );
};

export default JobDetailDrawer;
