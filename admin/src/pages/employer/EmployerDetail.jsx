import React from "react";
import parse from "html-react-parser";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { IconButtonCustom } from "../../components/shares";

const EmployerDetail = ({ employerDetailData = {} }) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="h-[270px] w-full relative rounded-md overflow-hidden">
          <div className="h-[64%] w-full">
            {employerDetailData?.coverImage ? (
              <img
                src={employerDetailData?.coverImage}
                alt=""
                className="h-full w-full"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-blue-gray-600 to-blue-gray-50"></div>
            )}
          </div>
          <div className="bg-blue-gray-700 h-[36%] relative">
            <img
              src={employerDetailData?.companyLogo}
              alt=""
              className="absolute flex-none left-5 top-0 -translate-y-[50%] h-36 w-36 rounded-full bg-white p-2"
            />
            <div className="ml-48 h-full flex justify-center flex-col gap-1">
              <Typography className="ml-3 uppercase text-xl text-white font-bold">
                {employerDetailData?.companyName}
              </Typography>
              <div className="flex items-center gap-4">
                <Typography className="flex items-center gap-2 font-bold text-sm text-white">
                  <span className="p-2 rounded-full bg-green-50 text-green-800">
                    <icons.BiSolidBuildingHouse />
                  </span>
                  {employerDetailData?.websiteUrl}
                </Typography>
                <Typography className="flex items-center gap-2 font-bold text-sm text-white">
                  <span className="p-2 rounded-full bg-green-50 text-green-800">
                    <icons.MdPhoneInTalk />
                  </span>
                  84+ {employerDetailData?.companyPhoneNumber}
                </Typography>
                <Typography className="flex items-center gap-2 font-bold text-sm text-white">
                  <span className="p-2 rounded-full bg-green-50 text-green-800">
                    <icons.BiSolidBuildingHouse />
                  </span>
                  {employerDetailData?.companySize}
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-blue-gray-100 rounded-md p-4">
          <Typography className="uppercase flex items-center gap-2 font-bold text-teal-800">
            <IconButtonCustom>
              <icons.IoLocationSharp size={24} />
            </IconButtonCustom>
            Giới thiệu công ty
          </Typography>
          <div className="text-sm py-2">
            {(employerDetailData?.companyDescription &&
              parse(employerDetailData?.companyDescription)) ||
              ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDetail;
