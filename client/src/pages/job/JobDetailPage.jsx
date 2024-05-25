import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import parse from "html-react-parser";
import {
  Breadcrumbs,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";

import { socket } from "../../socket";
import { useGetEvaluateSuitableJobQuery } from "../../redux/features/apis/analyticApi";
import {
  useGetJobDetailQuery,
  useGetListSimilarJobsQuery,
} from "../../redux/features/apis/jobApi";

import { useUserViewedJobMutation } from "../../redux/features/apis/userApi";
import {
  formatRemainingTime,
  formattedAmount,
  printExperienceText,
} from "../../utils/fn";
import { icons } from "../../utils/icons";

import { authSelect } from "../../redux/features/slices/authSlice";
import {
  Address,
  ShareButton,
  BoxChat,
  EvaluateSuitableJob,
  Modal,
  ButtonCustom,
  IconButtonCustom,
  Tag,
  EmploymentInfo,
  Container,
  Mapbox,
  Loading,
  TypographyCustom,
  JobInfoHeader,
} from "../../components/shares";
import { ApplyJobForm, LoginForm } from "../../components/forms";
import JobCardSmall from "../../components/jobs/JobCardSmall";

const JobDetailPage = () => {
  const { jobId } = useParams();
  const { user, isLoggedIn } = useSelector(authSelect);

  const [isFollowCompany, setIsFollowCompany] = useState(false);
  const [openApplyModal, setOpenApplyModal] = useState(false);
  const [openEvaluateJobModal, setOpenEvaluateJobModal] = useState(false);
  const [isBoxChatOpen, setIsBoxChatOpen] = useState(false);
  const [isBoxChatBubble, setIsBoxChatBubble] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);

  const { data: jobDetailData, isFetching } = useGetJobDetailQuery({ jobId });
  const { data: evaluateSuitableJobQueryData } = useGetEvaluateSuitableJobQuery(
    {
      userId: user?._id,
      candidateId: user?.candidateId?._id,
      jobId,
    },
    { skip: !user }
  );
  const { data: getListSimilarJobsData, isFetching: isFetchingSimilarJobs } =
    useGetListSimilarJobsQuery(
      {
        jobId,
        industry: jobDetailData?.data?.industry,
      },
      { skip: !jobId || !jobDetailData }
    );
  const [userViewedJob] = useUserViewedJobMutation();

  // Cuộn đến đầu trang khi component được render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Xử lý việc người dùng xem công việc và kiểm tra đăng nhập trước khi thực hiện
  useEffect(() => {
    if (!isLoggedIn) {
      setIsOpenLoginModal(true);
    } else {
      const userViewedJobApi = async () => {
        await userViewedJob({
          userId: user?._id,
          jobId,
        });
      };
      userViewedJobApi();
    }
  }, [jobId, user?._id, userViewedJob, isLoggedIn]);

  // Kiểm tra trạng thái đăng nhập và theo dõi công ty nếu đã đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      setIsOpenLoginModal(true);
    } else {
      setIsFollowCompany(
        jobDetailData?.data?.employerId?.followerIds?.includes(user?._id)
      );
    }
  }, [jobDetailData?.data?.employerId?.followerIds, user?._id, isLoggedIn]);

  // Xử lý hành động huỷ theo dõi công ty
  const handleUnfollowCompany = () => {
    if (!isLoggedIn) {
      setIsOpenLoginModal(true);
    } else {
      socket?.emit("unfollow_employer", {
        employerId: jobDetailData?.data?.employerId?._id,
        userId: user?._id,
      });
      setIsFollowCompany(false);
    }
  };

  // Xử lý hành động theo dõi công ty
  const handleFollowCompany = () => {
    if (!isLoggedIn) {
      setIsOpenLoginModal(true);
    } else {
      try {
        socket?.emit("follow_employer", {
          employerId: jobDetailData?.data?.employerId?._id,
          userId: user?._id,
        });
      } catch (error) {}
      setIsFollowCompany(true);
    }
  };

  // Xử lý sự kiện người dùng bắt đầu một cuộc trò chuyện mới
  const handleStartConversation = () => {
    if (!isLoggedIn) {
      setIsOpenLoginModal(true);
    } else {
      setIsBoxChatOpen(true);
      setIsBoxChatBubble(false);
      try {
        socket?.emit("start_conversation", {
          employerId: jobDetailData?.data?.employerId?._id,
          userId: user?._id,
        });
      } catch (error) {}
    }
  };

  return (
    <div className="px-[110px] py-[20px] flex flex-col gap-2 relative">
      <div className="fixed left-12 top-36">
        <ShareButton jobDetailData={jobDetailData} />
      </div>
      {isBoxChatOpen && (
        <BoxChat
          isBoxChatOpen={isBoxChatOpen}
          setIsBoxChatOpen={setIsBoxChatOpen}
          setIsBoxChatBubble={setIsBoxChatBubble}
          isBoxChatBubble={isBoxChatBubble}
        />
      )}
      {isBoxChatBubble && (
        <button
          className="h-14 w-14 flex items-center justify-center rounded-full bg-[#212f3f] text-light-blue-600 fixed bottom-[90px] right-6 shadow-2xl z-40"
          onClick={() => {
            setIsBoxChatBubble(false);
            setIsBoxChatOpen(true);
          }}
        >
          <icons.BsMessenger size={28} />
        </button>
      )}
      {(isFetching || isFetchingSimilarJobs) && <Loading />}
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
            <JobInfoHeader
              text="Thông tin công việc tuyển dụng"
              icon={<icons.IoBriefcase size={24} />}
            />
            <TypographyCustom
              text={jobDetailData?.data?.recruitmentTitle}
              className="uppercase text-[#212f3f] font-extrabold text-2xl"
            />
            <div className="grid grid-cols-3">
              <EmploymentInfo
                title="Mức lương"
                icon={<icons.AiFillDollarCircle size={30} />}
              >
                {jobDetailData?.data?.salaryType === "Trong khoảng"
                  ? `Từ ${formattedAmount(
                      jobDetailData?.data?.salaryFrom
                    )} Đến ${formattedAmount(jobDetailData?.data?.salaryTo)}`
                  : jobDetailData?.data?.salaryType === "Từ"
                  ? `Từ ${formattedAmount(jobDetailData?.data?.salaryFrom)}`
                  : jobDetailData?.data?.salaryType === "Đến"
                  ? `Đến ${formattedAmount(jobDetailData?.data?.salaryTo)}`
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
                {printExperienceText(jobDetailData?.data?.experience)}
              </EmploymentInfo>
            </div>
            <div className="flex items-center gap-3">
              {jobDetailData?.data?.skills &&
                jobDetailData?.data?.skills.map((skill, index) => (
                  <Tag
                    key={index}
                    className="text-indigo-700 bg-indigo-50 !px-3 !py-2 border border-indigo-400"
                  >
                    {skill}
                  </Tag>
                ))}
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="bg-[#212f3f] !px-20 hover:bg-blue-gray-700 transition-all flex items-center  gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isLoggedIn) {
                    setIsOpenLoginModal(true);
                  } else {
                    setOpenApplyModal(true);
                  }
                }}
              >
                <icons.IoMdSend size={24} />
                Ứng tuyển
              </Button>
              <Button
                className="bg-[#212f3f] !px-20 hover:bg-blue-gray-700 transition-all flex items-center  gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isLoggedIn) {
                    setIsOpenLoginModal(true);
                  } else {
                    setOpenEvaluateJobModal(true);
                  }
                }}
              >
                <icons.PiChartDonutFill size={24} />
                Xem mức độ phù hợp
              </Button>
              <IconButton className="bg-gray-400 hover:bg-gray-500 transition-all p-2">
                <icons.IoBookmark size={24} />
              </IconButton>
            </div>
          </Container>
          <Container>
            <JobInfoHeader
              text="Thông tin chi tiết tin tuyển dụng"
              icon={<icons.FaCircleInfo size={24} />}
            />
            <Typography className="uppercase text-[#212f3f] font-extrabold text-2xl">
              {jobDetailData?.data?.recruitmentTitle}
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
          <Container>
            <JobInfoHeader
              text="Việc làm liên quan"
              icon={<icons.FaCircleInfo size={24} />}
            />
            {getListSimilarJobsData?.data?.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {getListSimilarJobsData?.data?.map((job) => {
                  return <JobCardSmall key={job?._id} jobItem={job} />;
                })}
              </div>
            )}
          </Container>
        </div>
        <div className="col-span-4 flex flex-col gap-2">
          <Container className="flex flex-col gap-2">
            <JobInfoHeader
              text="Thông tin công ty"
              icon={<icons.BiSolidBuildingHouse size={24} />}
            />
            <div className="flex items-center gap-2">
              <Link
                to={`/company-profile/${jobDetailData?.data?.employerId?._id}`}
              >
                <img
                  src={jobDetailData?.data?.employerId?.companyLogo}
                  alt={jobDetailData?.data?.employerId?.companyName}
                  className="h-14 w-14 p-1 bg-white !rounded-md border flex-none"
                />
              </Link>
              <div className="flex flex-col ">
                <div className="flex items-center gap-2 ">
                  <Link
                    to={`/company-profile/${jobDetailData?.data?.employerId?._id}`}
                    className="uppercase font-bold text-light-blue-600 name"
                  >
                    {jobDetailData?.data?.employerId?.companyName}
                  </Link>
                  {jobDetailData?.data?.employerId?.isBuyedPremium && (
                    <span className="text-[#20d5ec]">
                      <icons.BsCheckCircleFill size={18} />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Typography className="flex items-center gap-2 font-bold text-xs">
                    <span className="p-2 rounded-full bg-green-50 text-green-800">
                      <icons.MdEmail />
                    </span>
                    {jobDetailData?.data?.employerId?.companyEmail}
                  </Typography>
                  |
                  <Typography className="flex items-center gap-2 font-bold text-xs">
                    <span className="p-2 rounded-full bg-green-50 text-green-800">
                      <icons.MdPhoneInTalk />
                    </span>
                    {jobDetailData?.data?.employerId?.companyPhoneNumber}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-center">
              {isFollowCompany ? (
                <ButtonCustom
                  className="bg-gray-300 hover:bg-gray-400 text-black flex items-center gap-2"
                  onClick={handleUnfollowCompany}
                >
                  <icons.FaUserCheck size={18} />
                  <Typography className="text-xs font-bold">
                    Đang theo dõi
                  </Typography>
                </ButtonCustom>
              ) : (
                <ButtonCustom
                  className="bg-gray-300 hover:bg-gray-400 text-black flex items-center gap-2"
                  onClick={handleFollowCompany}
                >
                  <icons.FaUserPlus size={18} />
                  <Typography className="text-xs font-bold">
                    Theo dõi
                  </Typography>
                </ButtonCustom>
              )}
              <ButtonCustom
                className="bg-gray-300 hover:bg-gray-400 text-black"
                onClick={handleStartConversation}
              >
                <icons.BsMessenger size={18} />
                Nhắn tin
              </ButtonCustom>
            </div>
            <Link
              to={`/company-profile/${jobDetailData?.data?.employerId?._id}`}
              className="text-blue-600 italic text-sm flex items-center justify-center gap-2 hover:underline transition-all"
            >
              <Typography className="text-sm font-bold">
                Xem trang công ty
              </Typography>
              <span>
                <icons.TbExternalLink size={16} />
              </span>
            </Link>
          </Container>
          <Container className="flex flex-col gap-2">
            <Typography className="flex items-center gap-2 font-bold text-teal-800">
              <IconButtonCustom>
                <icons.IoLocationSharp size={24} />
              </IconButtonCustom>
              Địa điểm làm việc
            </Typography>
            <Address
              province={jobDetailData?.data?.workRegion?.province}
              district={jobDetailData?.data?.workRegion?.district}
              ward={jobDetailData?.data?.workRegion?.ward}
              exactAddress={jobDetailData?.data?.workRegion?.exactAddress}
            />
            <div className="h-[220px] w-full border border-gray-400 rounded-md overflow-hidden">
              <Mapbox workRegion={jobDetailData?.data?.workRegion} />
            </div>
          </Container>
          <Container className="flex flex-col gap-3">
            <JobInfoHeader
              text="Thông tin công việc thêm"
              icon={<icons.FaCirclePlus size={24} />}
            />
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
                {printExperienceText(jobDetailData?.data?.experience)}
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
      <Modal
        open={openApplyModal}
        handleOpen={() => setOpenApplyModal(!openApplyModal)}
      >
        <ApplyJobForm
          jobItem={jobDetailData?.data}
          setOpen={setOpenApplyModal}
        />
      </Modal>
      <Modal
        open={openEvaluateJobModal}
        handleOpen={() => setOpenEvaluateJobModal(!openEvaluateJobModal)}
        size="lg"
      >
        <EvaluateSuitableJob
          setOpen={setOpenEvaluateJobModal}
          data={evaluateSuitableJobQueryData}
        />
      </Modal>
      <LoginForm open={isOpenLoginModal} handleOpen={setIsOpenLoginModal} />
    </div>
  );
};

export default JobDetailPage;
