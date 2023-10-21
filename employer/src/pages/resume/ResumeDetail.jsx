import React from "react";
import PDFViewer from "../../components/PDFViewer";
import { useParams } from "react-router-dom";
import { useGetApplyJobDetailQuery } from "../../redux/features/apis/apply";
import { authSelect } from "../../redux/features/slices/authSlice";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import Loading from "../../components/Loading";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { formattedAmount, formattedProvinceNames } from "../../utils/fn";
import Tag from "../../components/Tag";

const ResumeDetail = () => {
  const { applyJobId } = useParams();

  const { user } = useSelector(authSelect);

  const { data: applyJobDetailData, isFetching } = useGetApplyJobDetailQuery({
    userId: user?._id,
    employerId: user?.ownerEmployerId?._id
      ? user?.ownerEmployerId?._id
      : skipToken,
    applyId: applyJobId,
  });

  return (
    <div className="">
      {isFetching && <Loading />}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-8 py-4 px-4">
          <PDFViewer url={applyJobDetailData?.data?.CVpdf} />
        </div>
        <div className="col-span-4 bg-white h-[calc(100vh-60px)] border-l border-blue-gray-100 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={applyJobDetailData?.data?.employerId?.companyLogo}
                  alt={applyJobDetailData?.data?.jobId?.recruitmentTitle}
                  className="h-14 w-14 object-contain rounded-xl bg-blue-gray-800"
                />
                <div className="flex flex-col gap-1">
                  <Typography className="text-lg font-bold text-teal-900 name">
                    {applyJobDetailData?.data?.jobId?.recruitmentTitle}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag
                className="text-red-700 bg-red-50"
                icon={<icons.BsCalendar3 size={12} />}
              >
                {applyJobDetailData?.data?.jobId?.jobType}
              </Tag>
              <Tag
                className="text-teal-700 bg-teal-50"
                icon={<icons.HiLocationMarker size={14} />}
              >
                {formattedProvinceNames(
                  applyJobDetailData?.data?.jobId?.workRegion?.province
                )}
              </Tag>
              <Tag
                className="text-amber-900 bg-amber-50"
                icon={<icons.AiFillDollarCircle size={14} />}
              >
                {applyJobDetailData?.data?.jobId?.salaryType === "Trong khoảng"
                  ? `Từ ${formattedAmount(
                      applyJobDetailData?.data?.jobId?.salaryFrom
                    )} Đến ${formattedAmount(
                      applyJobDetailData?.data?.jobId?.salaryFrom
                    )}`
                  : applyJobDetailData?.data?.jobId?.salaryType === "Từ"
                  ? `Từ ${formattedAmount(
                      applyJobDetailData?.data?.jobId?.salaryFrom
                    )}`
                  : applyJobDetailData?.data?.jobId?.salaryType === "Đến"
                  ? `Đến ${formattedAmount(
                      applyJobDetailData?.data?.jobId?.salaryFrom
                    )}`
                  : "Thỏa thuận"}
              </Tag>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {applyJobDetailData?.data?.jobId?.skills &&
                applyJobDetailData?.data?.jobId?.skills.map((skill, index) => (
                  <Tag
                    className="text-indigo-700 bg-indigo-50 flex-wrap"
                    key={index}
                  >
                    {skill}
                  </Tag>
                ))}
            </div>
          </div>
          <hr className="my-3 border-blue-gray-100" />
          <div>{}</div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetail;
