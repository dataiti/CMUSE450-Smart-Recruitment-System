import React from "react";
import CarouselCustom from "../../components/CarouselCustom";
import { images } from "../../assets/images";
import Loading from "../../components/Loading";
import { loyaltyProgramItem } from "../../utils/constants";
import { Typography } from "@material-tailwind/react";
import Container from "../../components/Container";
import { useGetListOfCategoriesQuery } from "../../redux/features/apis/categoryApi";

const HomePage = () => {
  const { data: listCategoriesData, isFetching } =
    useGetListOfCategoriesQuery();

  return (
    <div className="flex flex-col gap-4 py-[20px]">
      {isFetching && <Loading />}
      <div className="px-[110px] grid grid-cols-12 gap-2">
        <div className="col-span-8">
          <CarouselCustom images={images.listBannerImage} />
        </div>
        <div className="col-span-4 flex flex-col gap-2">
          <img src={images.banner3} alt="" className="rounded-md" />
          <img src={images.banner1} alt="" className="rounded-md" />
        </div>
      </div>
      <div className="h-28 w-[100%] bg-zinc-200 grid grid-cols-5 gap-5 py-2 px-[110px] bg-white">
        {loyaltyProgramItem.map((item, index) => {
          return (
            <div key={index} className="flex gap-2 items-center ">
              <span className="p-2 bg-indigo-50 rounded-md text-[#212f3f]">
                {item.icon}
              </span>
              <div className="flex flex-col gap-1">
                <Typography className="text-sm font-bold">
                  {item.display}
                </Typography>
                <Typography className="text-xs text-gray-500 font-bold">
                  {item.subDisplay}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-4 px-[110px]">
        <Container className="grid grid-cols-7 gap-1 !p-1 sticky z-20 top-[80px] !bg-blue-gray-100">
          {listCategoriesData?.data?.length > 0 &&
            listCategoriesData?.data?.map((category) => {
              return (
                <div
                  key={category}
                  className="flex flex-col items-center gap-1 bg-green-50 rounded-md py-3 hover:bg-green-100/80 transition-all cursor-pointer"
                >
                  <div className="h-24 w-24 p-3 bg-white rounded-full">
                    <img
                      src={category?.image}
                      alt={category?.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <Typography className="text-xs font-bold text-green-900">
                    {category?.name}
                  </Typography>
                </div>
              );
            })}
        </Container>
        <Container>Cong ty hang dau</Container>
        <Container>Cac cong viec moi</Container>
      </div>
    </div>
  );
};

export default HomePage;
