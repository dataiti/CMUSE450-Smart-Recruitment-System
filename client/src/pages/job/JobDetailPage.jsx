import React from "react";
import { useGetJobDetailQuery } from "../../redux/features/apis/jobApi";
import { Link, useParams } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import Loading from "../../components/Loading";
import Container from "../../components/Container";
import { icons } from "../../utils/icons";
import Mapbox from "../../components/Mapbox";
import parse from "html-react-parser";
import { formatRemainingTime, formattedAmount } from "../../utils/fn";
import EmploymentInfo from "../../components/EmploymentInfo";
import Tag from "../../components/Tag";
import IconButtonCustom from "../../components/IconButtonCustom";

const JobDetailPage = () => {
  const { jobId } = useParams();

  const { data: jobDetailData, isFetching } = useGetJobDetailQuery({ jobId });

  return (
    <div className="px-[110px] py-[20px] flex flex-col gap-2">
      {isFetching && <Loading />}
      <Breadcrumbs fullWidth className="bg-white">
        <Link to="/" className="text-light-blue-500 text-sm font-bold">
          Trang chủ
        </Link>
        <Link
          to="/categories-job"
          className="text-light-blue-500 text-sm font-bold"
        >
          Danh mục việc làm
        </Link>
        <Link to="/category" className="font-bold text-sm">
          {jobDetailData?.data?.recruitmentCampaignName}
        </Link>
      </Breadcrumbs>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-8 flex flex-col gap-2">
          <Container className="flex flex-col gap-3 bg-white rounded-md">
            <Typography className="flex items-center gap-2 font-bold text-teal-800">
              <IconButtonCustom>
                <icons.IoBriefcase size={24} />
              </IconButtonCustom>
              Thông tin công việc tuyển dụng
            </Typography>
            <Typography className="uppercase text-[#212f3f] font-extrabold text-2xl">
              {jobDetailData?.data?.recruitmentTitle}
            </Typography>
            <div className="grid grid-cols-3">
              <EmploymentInfo
                title="Mức lương"
                icon={<icons.AiFillDollarCircle size={30} />}
              >
                {jobDetailData?.data?.salaryType === "Trong khoảng"
                  ? `Từ ${formattedAmount(
                      jobDetailData?.data?.salaryFrom
                    )} Đến ${formattedAmount(jobDetailData?.data?.salaryFrom)}`
                  : jobDetailData?.data?.salaryType === "Từ"
                  ? `Từ ${formattedAmount(jobDetailData?.data?.salaryFrom)}`
                  : jobDetailData?.data?.salaryType === "Đến"
                  ? `Đến ${formattedAmount(jobDetailData?.data?.salaryFrom)}`
                  : "Thỏa thuận"}
              </EmploymentInfo>
              <EmploymentInfo
                title="Địa điểm"
                icon={<icons.HiLocationMarker size={30} />}
              >
                {jobDetailData?.data?.workRegion?.province}
              </EmploymentInfo>
              <EmploymentInfo
                title="Kinh nghiệm"
                icon={<icons.AiFillClockCircle size={30} />}
              >
                {jobDetailData?.data?.experience}
              </EmploymentInfo>
            </div>
            <div className="flex items-center gap-3">
              {jobDetailData?.data?.skills &&
                jobDetailData?.data?.skills.map((skill, index) => (
                  <Tag
                    key={index}
                    className="text-indigo-700 bg-indigo-50 !px-6 !py-2 !text-base"
                  >
                    {skill}
                  </Tag>
                ))}
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-[#212f3f] !px-20 hover:bg-teal-800 transition-all">
                Ứng tuyển
              </Button>
              <IconButton className="bg-teal-900 hover:bg-teal-800 transition-all">
                <icons.IoBookmark size={24} />
              </IconButton>
            </div>
          </Container>
          <Container>
            <Typography className="flex items-center gap-2 font-bold text-teal-800">
              <IconButtonCustom>
                <icons.FaCircleInfo size={24} />
              </IconButtonCustom>
              Thông tin chi tiết tin tuyển dụng
            </Typography>
            <div className="">
              <Typography className="text-light-blue-600 font-bold uppercase text-sm pb-1">
                Hạn nộp CV
              </Typography>
              <Typography className="text-sm py-2 font-bold">
                Còn{" "}
                {formatRemainingTime(jobDetailData?.data?.applicationDeadline)}{" "}
                để nộp CV ứng tuyển
              </Typography>
            </div>
            <div className="">
              <Typography className="text-light-blue-600 font-bold uppercase text-sm pb-1">
                Mô tả công việc
              </Typography>
              <div className="text-sm py-2">
                {(jobDetailData?.data?.jobDescription &&
                  parse(jobDetailData?.data?.jobDescription)) ||
                  ""}
              </div>
            </div>
            <div className="">
              <Typography className="text-light-blue-600 font-bold uppercase text-sm pb-1">
                Yêu cầu ứng viên
              </Typography>
              <div className="text-sm py-2">
                {(jobDetailData?.data?.candidateRequirements &&
                  parse(jobDetailData?.data?.candidateRequirements)) ||
                  ""}
              </div>
            </div>
            <div className="">
              <Typography className="text-light-blue-600 font-bold uppercase text-sm pb-1">
                Phúc lợi ứng viên
              </Typography>
              <div className="text-sm py-2">
                {(jobDetailData?.data?.candidateBenefits &&
                  parse(jobDetailData?.data?.candidateBenefits)) ||
                  ""}
              </div>
            </div>
          </Container>
        </div>
        <div className="col-span-4 flex flex-col gap-2">
          <Container className="flex flex-col gap-2">
            <Typography className="flex items-center gap-2 font-bold text-teal-800">
              <IconButtonCustom>
                <icons.BiSolidBuildingHouse size={24} />
              </IconButtonCustom>
              Thông tin công ty
            </Typography>
            <div className="flex items-center gap-2">
              <img
                src={jobDetailData?.data?.employerId?.companyLogo}
                alt={jobDetailData?.data?.employerId?.companyName}
                className="w-12 h-12 rounded-lg border border-gray-400 bg-white object-contain"
              />
              <Typography className="uppercase font-bold text-light-blue-600">
                Công ty{" "}
                {jobDetailData?.data?.employerId?.companyIndustry +
                  " " +
                  jobDetailData?.data?.employerId?.companyName}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <Typography className="flex items-center gap-2 font-bold text-xs">
                <icons.MdEmail />
                {jobDetailData?.data?.employerId?.companyEmail}
              </Typography>
              <Typography className="flex items-center gap-2 font-bold text-xs">
                <icons.MdPhoneInTalk />
                {jobDetailData?.data?.employerId?.companyPhoneNumber}
              </Typography>
              <Typography className="flex items-center gap-2 font-bold text-xs">
                <icons.FaUserFriends />
                {jobDetailData?.data?.employerId?.companySize}
              </Typography>
            </div>
            <Link
              to={`/company-profile/${jobDetailData?.data?._id}`}
              className="text-blue-600 italic text-sm text-center hover:underline"
            >
              Xem thêm
            </Link>
          </Container>
          <Container className="flex flex-col gap-2">
            <Typography className="flex items-center gap-2 font-bold text-teal-800">
              <IconButtonCustom>
                <icons.IoLocationSharp size={24} />
              </IconButtonCustom>
              Địa điểm làm việc
            </Typography>
            <div className="flex flex-col gap-2">
              <Typography className=" font-bold text-sm">
                {jobDetailData?.data?.workRegion?.exactAddress}
              </Typography>
              <Typography className=" font-bold text-sm">
                {jobDetailData?.data?.workRegion?.ward}
              </Typography>
              <Typography className=" font-bold text-sm">
                {jobDetailData?.data?.workRegion?.district}
              </Typography>
              <Typography className=" font-bold text-sm">
                {jobDetailData?.data?.workRegion?.province}
              </Typography>
            </div>
            <div className="h-[220px] w-full border border-gray-400 rounded-md overflow-hidden">
              <Mapbox workRegion={jobDetailData?.data?.workRegion} />
            </div>
          </Container>
          <Container className="flex flex-col gap-3">
            <Typography className="flex items-center gap-2 font-bold text-teal-800">
              <IconButtonCustom>
                <icons.FaCirclePlus size={24} />
              </IconButtonCustom>
              Thông tin công việc thêm
            </Typography>
            <div className="flex flex-col gap-2">
              <EmploymentInfo
                title="Số lượng tuyển"
                icon={<icons.HiLocationMarker size={30} />}
              >
                {jobDetailData?.data?.vacancyCount}
              </EmploymentInfo>
              <EmploymentInfo
                title="Cấp bậc"
                icon={<icons.HiLocationMarker size={30} />}
              >
                {jobDetailData?.data?.level}
              </EmploymentInfo>
              <EmploymentInfo
                title="Giới tính"
                icon={<icons.HiLocationMarker size={30} />}
              >
                {jobDetailData?.data?.gender}
              </EmploymentInfo>
              <EmploymentInfo
                title="Kinh nghiệm"
                icon={<icons.HiLocationMarker size={30} />}
              >
                {jobDetailData?.data?.experience}
              </EmploymentInfo>
              <EmploymentInfo
                title="Loại công việc"
                icon={<icons.HiLocationMarker size={30} />}
              >
                {jobDetailData?.data?.jobType}
              </EmploymentInfo>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
