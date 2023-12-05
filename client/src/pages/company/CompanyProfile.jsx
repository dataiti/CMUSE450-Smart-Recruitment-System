import { Breadcrumbs } from "@material-tailwind/react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetEmployerDetailQuery } from "../../redux/features/apis/employerApi";
import Loading from "../../components/Loading";
import Container from "../../components/Container";
import IconButtonCustom from "../../components/IconButtonCustom";
import Address from "../../components/Address";
import Mapbox from "../../components/Mapbox";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import parse from "html-react-parser";
import ShareButton from "../../components/ShareButton";
import { useState } from "react";
import { useGetListJobsByCompanyQuery } from "../../redux/features/apis/jobApi";
import JobCardSmall from "../../components/JobCardSmall";
import ButtonCustom from "../../components/ButtonCustom";

const CompanyProfile = () => {
  const { companyId } = useParams();

  const [limit, setLimit] = useState(6);

  const { data: companyDetailData, isFetching } = useGetEmployerDetailQuery({
    employerId: companyId,
  });

  const { data: listJobs, isFetchingListJobs } = useGetListJobsByCompanyQuery(
    { limit, employerId: companyId },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <div className="px-[110px] py-[20px] flex flex-col gap-2 relative">
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
          <div className="flex items-center justify-center gap-3 bg-white rounded-s-md">
            <Typography className="font-bold text-sm text-light-blue-500">
              Chia sẻ công ty qua:{" "}
            </Typography>
            <ShareButton isRow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
