// library
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import { images } from "../../assets/images";
import { loyaltyProgramItem } from "../../utils/constants";

// redux
import { useGetListOfCategoriesQuery } from "../../redux/features/apis/categoryApi";
import { useGetTechnicalTrendingChartQuery } from "../../redux/features/apis/analyticApi";
import { useGetListOfJobsForHomaPageQuery } from "../../redux/features/apis/jobApi";
import { authSelect } from "../../redux/features/slices/authSlice";

// component
import {
  ButtonCustom,
  Container,
  CarouselCustom,
  Loading,
  TypographyCustom,
} from "../../components/shares";
import { JobCardSmall } from "../../components/jobs";
import { LineChart } from "../../components/charts";

const HomePage = () => {
  const { user } = useSelector(authSelect);

  const [limit, setLimit] = useState(12);

  // API
  const { data: categoriesData, isFetching: fetchingCategories } =
    useGetListOfCategoriesQuery();
  const { data: techTrendingData } = useGetTechnicalTrendingChartQuery();
  const { data: homePageJobs, isFetching: fetchingHomePageJobs } =
    useGetListOfJobsForHomaPageQuery(
      { userId: user?._id, limit },
      {
        skip: !user?._id,
        refetchOnMountOrArgChange: true,
      }
    );

  const handleLoadMoreJob = () => {
    setLimit((prev) => prev + 6);
  };

  return (
    <div className="flex flex-col gap-4 py-[20px]">
      {(fetchingCategories || fetchingHomePageJobs) && <Loading />}
      <div className="px-[110px] grid grid-cols-12 gap-2">
        <div className="col-span-8">
          <CarouselCustom images={images.listBannerImage} />
        </div>
        <Container className="!bg-gradient-to-l from-[#304352] to-[#cbd5e1] h-full col-span-4 flex flex-col gap-2">
          <Typography className="text-light-blue-600 text-sm font-bold uppercase">
            Biểu đồ xu hướng công nghệ tuyển dụng
          </Typography>
          <LineChart data={techTrendingData?.data} />
        </Container>
      </div>
      <div className="h-20 w-[100%] bg-zinc-200 grid grid-cols-5 gap-5 py-2 px-[110px] bg-blue-gray-300">
        {loyaltyProgramItem.map((item, index) => (
          <div key={index} className="flex gap-2 items-center ">
            <span className="p-2 bg-indigo-50 rounded-md text-purple-500">
              {item.icon}
            </span>
            <div className="flex flex-col gap-1">
              <TypographyCustom text={item.display} />
              <TypographyCustom
                text={item.subDisplay}
                className="text-xs text-white"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 px-[110px] ">
        <Container className="grid grid-cols-7 gap-1 !p-1 !bg-blue-gray-200">
          {categoriesData?.data?.length > 0 &&
            categoriesData?.data?.map((category) => (
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
                <TypographyCustom
                  text={category?.name}
                  className="text-xs text-black"
                />
              </Link>
            ))}
        </Container>
        <Container className="bg-blue-gray-100">
          {homePageJobs?.data && (
            <Tabs id="custom-animation" value="all" className="z-20">
              <TabsHeader>
                {homePageJobs.data.map((job) => (
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
                {homePageJobs.data.map((job) => (
                  <TabPanel key={job?.value} value={job?.value}>
                    <div className="grid grid-cols-3 gap-2">
                      {job?.data?.map((jobItem) => (
                        <JobCardSmall jobItem={jobItem} key={jobItem?._id} />
                      ))}
                    </div>
                  </TabPanel>
                ))}
              </TabsBody>
            </Tabs>
          )}
        </Container>
        <div className="flex justify-center">
          <ButtonCustom onClick={handleLoadMoreJob}>Xem Thêm</ButtonCustom>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
