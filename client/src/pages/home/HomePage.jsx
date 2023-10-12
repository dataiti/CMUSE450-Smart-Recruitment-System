import React from "react";
import CarouselCustom from "../../components/CarouselCustom";
import { images } from "../../assets/images";
import Loading from "../../components/Loading";
import { loyaltyProgramItem } from "../../utils/constants";
import { Typography } from "@material-tailwind/react";
import Container from "../../components/Container";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-4 py-[20px]">
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
              <span className="p-2 bg-blue-gray-100 rounded-md text-[#212f3f]">
                {item.icon}
              </span>
              <div className="flex flex-col gap-1">
                <Typography className="text-sm font-semibold">
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
        <Container>Danh muc cong viec</Container>
        <Container>Cong ty hang dau</Container>
        <Container>Cac cong viec moi</Container>
      </div>
    </div>
  );
};

export default HomePage;
