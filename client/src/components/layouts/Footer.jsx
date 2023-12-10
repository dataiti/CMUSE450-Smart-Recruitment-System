import React from "react";
import { icons } from "../../utils/icons";
import { images } from "../../assets/images";

const Footer = () => {
  return (
    <footer>
      <div className="w-full bg-black py-5 ">
        <div className="py-5 flex flex-col gap-2 items-center justify-center">
          <img src={images.logo} alt="" className="w-16" />
          <span className="text-[20px] font-extrabold text-white">
            SMART RECRUITMENT SYSTEM
          </span>
        </div>
        <div className="w-[80%] mx-auto grid grid-cols-5 text-gray-400">
          <div className="">
            <h2 className="text-white font-bold pb-4 text-lg">Nhóm 19</h2>
            <ul className="flex flex-col gap-2">
              <li>Đạt, Nguyễn Thành</li>
              <li>Quang, Tran Minh</li>
              <li>Khoa, Doan Ngoc Anh</li>
              <li>Thang, Nguyen Tran Anh</li>
            </ul>
          </div>
          <div className="col-span-2">
            <h2 className="text-white font-bold pb-4 text-lg">Email</h2>
            <ul className="flex flex-col gap-2">
              <li>nguyendat16111210@gmail.com</li>
              <li>quangyoung.tranminh@gmail.com</li>
              <li>12.doanngocanhkhoa125@gmail.com</li>
              <li>anhthang2529@gmail.com</li>
            </ul>
          </div>
          <div className="col-span-1">
            <h2 className="text-white font-bold pb-4 text-lg">Số điện thoại</h2>
            <ul className="flex flex-col gap-2">
              <li>84+ 0352694246</li>
              <li>84+ 0329398805</li>
              <li>84+ 0389876510</li>
              <li>84+ 0869132529</li>
            </ul>
          </div>
          <div className="">
            <h2 className="text-white font-bold pb-4 text-lg">
              Công nghệ sử dụng
            </h2>
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">
                  <icons.GrNode size={28} />
                </span>
                <span>NodeJS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-500">
                  <icons.GrReactjs size={28} />
                </span>
                <span>ReactJS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">
                  <icons.DiMongodb size={28} />
                </span>
                <span>MongoDB</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="">
                  <icons.SiExpress size={28} />
                </span>
                <span>ExpressJS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-500">
                  <icons.SiTailwindcss size={24} />
                </span>
                <span>Tailwind CSS</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="py-4 flex items-center justify-center text-sm font-bold bg-teal-900 text-white">
        Coppyright © 2023 All rights reserved | Design by NguyenDat 💗
      </div>
    </footer>
  );
};

export default Footer;
