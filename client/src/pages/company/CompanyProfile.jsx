import { Breadcrumbs } from "@material-tailwind/react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetEmployerDetailQuery } from "../../redux/features/apis/employerApi";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import parse from "html-react-parser";
import { useState } from "react";
import { useGetListJobsByCompanyQuery } from "../../redux/features/apis/jobApi";
import { JobCardSmall } from "../../components/jobs";
import {
  ButtonCustom,
  ShareButton,
  Address,
  Mapbox,
  IconButtonCustom,
  Container,
  Loading,
  BoxChat,
} from "../../components/shares";
import { socket } from "../../socket";
import { authSelect } from "../../redux/features/slices/authSlice";
import { useSelector } from "react-redux";
import { LoginForm } from "../../components/forms";

const CompanyProfile = () => {
  const { companyId } = useParams();

  const { user, isLoggedIn } = useSelector(authSelect);

  const [limit, setLimit] = useState(6);
  const [isBoxChatOpen, setIsBoxChatOpen] = useState(false);
  const [isBoxChatBubble, setIsBoxChatBubble] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);

  const { data: companyDetailData, isFetching } = useGetEmployerDetailQuery({
    employerId: companyId,
  });

  const { data: listJobs, isFetchingListJobs } = useGetListJobsByCompanyQuery(
    { limit, employerId: companyId },
    { refetchOnMountOrArgChange: true }
  );

  const handleStartConversation = () => {
    if (!isLoggedIn) {
      setIsOpenLoginModal(true);
    } else {
      setIsBoxChatOpen(true);
      setIsBoxChatBubble(false);
      try {
        socket?.emit("start_conversation", {
          employerId: companyId,
          userId: user?._id,
        });
      } catch (error) {}
    }
  };

  return (
    <div className="px-[110px] py-[20px] flex flex-col gap-2 relative">
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
      {(isFetching || isFetchingListJobs) && <Loading />}
      <Breadcrumbs fullWidth className="bg-white">
        <Link to="/" className="text-light-blue-500 text-sm font-bold">
          Trang chủ
        </Link>
        <Link to="/category" className="font-bold text-sm">
          Thông tin công ty & tin tuyển dụng từ{" "}
          {companyDetailData?.data?.companyName}
        </Link>
      </Breadcrumbs>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-9 flex flex-col gap-2">
          <div className="h-[270px] w-full relative rounded-md overflow-hidden">
            <div className="h-[64%] w-full">
              {companyDetailData?.data?.coverImage ? (
                <img
                  src={companyDetailData?.data?.coverImage}
                  alt=""
                  className="h-full w-full"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-blue-gray-600 to-blue-gray-50"></div>
              )}
            </div>
            <div className="bg-blue-gray-700 h-[36%] relative">
              <img
                src={companyDetailData?.data?.companyLogo}
                alt=""
                className="absolute flex-none left-5 top-0 -translate-y-[50%] h-36 w-36 rounded-full bg-white p-2"
              />
              <div className="ml-48 h-full flex justify-center flex-col gap-1">
                <Typography className="ml-3 uppercase text-xl text-white font-bold">
                  {companyDetailData?.data?.companyName}
                </Typography>
                <div className="flex items-center gap-4">
                  <Typography className="flex items-center gap-2 font-bold text-sm text-white">
                    <span className="p-2 rounded-full bg-green-50 text-green-800">
                      <icons.BiSolidBuildingHouse />
                    </span>
                    {companyDetailData?.data?.websiteUrl}
                  </Typography>
                  <Typography className="flex items-center gap-2 font-bold text-sm text-white">
                    <span className="p-2 rounded-full bg-green-50 text-green-800">
                      <icons.MdPhoneInTalk />
                    </span>
                    84+ {companyDetailData?.data?.companyPhoneNumber}
                  </Typography>
                  <Typography className="flex items-center gap-2 font-bold text-sm text-white">
                    <span className="p-2 rounded-full bg-green-50 text-green-800">
                      <icons.BiSolidBuildingHouse />
                    </span>
                    {companyDetailData?.data?.companySize}
                  </Typography>
                  <Typography className="flex items-center gap-2 font-bold text-sm text-white">
                    <span className="p-2 rounded-full bg-green-50 text-green-800">
                      <icons.MdEmail />
                    </span>
                    {companyDetailData?.data?.followerIds?.length} người theo
                    dõi
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <Container className="flex flex-col gap-2">
            <Typography className="uppercase flex items-center gap-2 font-bold text-teal-800">
              <IconButtonCustom>
                <icons.IoLocationSharp size={24} />
              </IconButtonCustom>
              Giới thiệu công ty
            </Typography>
            <div className="text-sm py-2">
              {(companyDetailData?.data?.companyDescription &&
                parse(companyDetailData?.data?.companyDescription)) ||
                ""}
            </div>
          </Container>
          <div className="grid grid-cols-2 gap-2">
            {listJobs?.data?.map((job) => (
              <JobCardSmall jobItem={job} key={job?._id} />
            ))}
          </div>
          <div className="flex justify-center">
            <ButtonCustom onClick={() => setLimit((prev) => prev + 6)}>
              Xem Thêm
            </ButtonCustom>
          </div>
        </div>
        <div className="col-span-3 flex flex-col gap-4">
          <Container className="flex flex-col gap-2">
            <Typography className="uppercase flex items-center gap-2 font-bold text-teal-800">
              <IconButtonCustom>
                <icons.IoLocationSharp size={24} />
              </IconButtonCustom>
              Vị trí công ty
            </Typography>
            <Address
              province={companyDetailData?.data?.addressId?.province}
              district={companyDetailData?.data?.addressId?.district}
              ward={companyDetailData?.data?.addressId?.ward}
              exactAddress={companyDetailData?.data?.addressId?.exactAddress}
            />
            <div className="h-[240px] w-full border border-gray-400 rounded-md overflow-hidden">
              <Mapbox workRegion={companyDetailData?.data?.addressId} />
            </div>
          </Container>
          <div className="bg-white p-2 rounded-md">
            <div className="flex justify-center items-center gap-2">
              <ButtonCustom className="bg-gray-300 hover:bg-gray-400 text-black flex items-center gap-2">
                <icons.FaUserPlus size={18} />
                <Typography className="text-xs font-bold">Theo dõi</Typography>
              </ButtonCustom>
              <ButtonCustom
                className="bg-gray-300 hover:bg-gray-400 text-black"
                onClick={handleStartConversation}
              >
                <icons.BsMessenger size={18} />
                Nhắn tin
              </ButtonCustom>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white rounded-s-md">
              <Typography className="font-bold text-sm text-light-blue-500">
                Chia sẻ công ty qua:{" "}
              </Typography>
              <ShareButton isRow />
            </div>
          </div>
        </div>
      </div>
      <LoginForm open={isOpenLoginModal} handleOpen={setIsOpenLoginModal} />
    </div>
  );
};

export default CompanyProfile;
