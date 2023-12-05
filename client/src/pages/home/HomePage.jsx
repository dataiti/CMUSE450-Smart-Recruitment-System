import React, { useState } from "react";
import CarouselCustom from "../../components/CarouselCustom";
import { images } from "../../assets/images";
import Loading from "../../components/Loading";
import { loyaltyProgramItem } from "../../utils/constants";
import { Typography } from "@material-tailwind/react";
import Container from "../../components/Container";
import { useGetListOfCategoriesQuery } from "../../redux/features/apis/categoryApi";
import LineChart from "../../components/LineChart";
import { useGetTechnicalTrendingChartQuery } from "../../redux/features/apis/analyticApi";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useGetListOfJobsForHomaPageQuery } from "../../redux/features/apis/jobApi";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import ButtonCustom from "../../components/ButtonCustom";
import { Link } from "react-router-dom";
import JobCardSmall from "../../components/JobCardSmall";

const HomePage = () => {
  const { user } = useSelector(authSelect);

  const [limit, setLimit] = useState(12);

  const { data: listCategoriesData, isFetching } =
    useGetListOfCategoriesQuery();

  const { data: technicalTrendingChartData } =
    useGetTechnicalTrendingChartQuery();

  const { data: listJobsForHomePageData, isFetching: isFetchingListJobs } =
    useGetListOfJobsForHomaPageQuery(
      { userId: user?._id, limit },
      { refetchOnMountOrArgChange: true }
    );

  return (
    <div className="flex flex-col gap-4 py-[20px]">
      {(isFetching || isFetchingListJobs) && <Loading />}
      <div className="px-[110px] grid grid-cols-12 gap-2">
        <div className="col-span-8">
          <CarouselCustom images={images.listBannerImage} />
        </div>
        <Container className="!bg-gradient-to-l from-[#304352] to-[#cbd5e1] h-full col-span-4 flex flex-col gap-2">
          <Typography className="text-light-blue-600 text-sm font-bold uppercase">
            Biểu đồ xu hướng công nghệ tuyển dụng
          </Typography>
          <LineChart data={technicalTrendingChartData?.data} />
        </Container>
      </div>
      <div className="h-20 w-[100%] bg-zinc-200 grid grid-cols-5 gap-5 py-2 px-[110px] bg-blue-gray-300">
        {loyaltyProgramItem.map((item, index) => {
          return (
            <div key={index} className="flex gap-2 items-center ">
              <span className="p-2 bg-indigo-50 rounded-md text-purple-500">
                {item.icon}
              </span>
              <div className="flex flex-col gap-1">
                <Typography className="text-sm font-bold">
                  {item.display}
                </Typography>
                <Typography className="text-xs text-white font-bold">
                  {item.subDisplay}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-4 px-[110px] ">
        <Container className="grid grid-cols-7 gap-1 !p-1 !bg-blue-gray-200">
          {listCategoriesData?.data?.length > 0 &&
            listCategoriesData?.data?.map((category) => {
              return (
                <Link
                  to={`/categories-job?category=${category?.name}`}
                  key={category?._id}
                  className="flex flex-col items-center gap-1 bg-gray-200 rounded-md py-3 hover:bg-gray-300 transition-all cursor-pointer"
                >
                  <div className="h-24 w-24 p-3 bg-white rounded-full">
                    <img
                      src={category?.image}
                      alt={category?.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <Typography className="text-xs font-bold text-black">
                    {category?.name}
                  </Typography>
                </Link>
              );
            })}
        </Container>
        <Container className="bg-blue-gray-100">
          <Tabs id="custom-animation" value="all" className="z-20">
            <TabsHeader>
              {listJobsForHomePageData?.data?.map((job) => (
                <Tab
                  key={job?.value}
                  value={job?.value}
                  className="text-sm font-bold text-light-blue-600 "
                >
                  {job?.label}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody
              animate={{
                initial: { y: 250 },
                mount: { y: 0 },
                unmount: { y: 250 },
              }}
            >
              {listJobsForHomePageData?.data?.map((job) => (
                <TabPanel key={job?.value} value={job?.value}>
                  <div className="grid grid-cols-3 gap-2">
                    {job?.data?.map((jobItem) => {
                      return (
                        <JobCardSmall jobItem={jobItem} key={jobItem?._id} />
                      );
                    })}
                  </div>
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </Container>
        <div className="flex justify-center">
          <ButtonCustom onClick={() => setLimit((prev) => prev + 6)}>
            Xem Thêm
          </ButtonCustom>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
