import React, { useState } from "react";
import {
  ButtonCustom,
  CandidateCard,
  Modal,
  SettingWorkPosition,
} from "../../components/shares";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";

const CVRecomendationPage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <div className="m-[10px] grid grid-cols-4 gap-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between bg-blue-gray-700 p-3 rounded-full">
          <Typography className="font-bold text-white">
            Fullstack Developer
          </Typography>
          <div className="flex items-center gap-1">
            <button className="text-orange-400">
              <icons.IoAddCircle size={24} />
            </button>
            <button className="text-red-500">
              <icons.IoCloseCircleSharp size={24} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CandidateCard />
          <CandidateCard />
          <CandidateCard />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between bg-blue-gray-700 p-3 rounded-full">
          <Typography className="font-bold text-white">
            Quản lý dự án
          </Typography>
          <div className="flex items-center gap-1">
            <button className="text-orange-400">
              <icons.IoAddCircle size={24} />
            </button>
            <button className="text-red-500">
              <icons.IoCloseCircleSharp size={24} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CandidateCard />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between bg-blue-gray-700 p-3 rounded-full">
          <Typography className="font-bold text-white">
            Mobile Developer
          </Typography>
          <div className="flex items-center gap-1">
            <button className="text-orange-400">
              <icons.IoAddCircle size={24} />
            </button>
            <button className="text-red-500">
              <icons.IoCloseCircleSharp size={24} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CandidateCard />
          <CandidateCard />
        </div>
      </div>
      <div>
        <ButtonCustom
          onClick={() => setIsOpenModal(true)}
          className="rounded-full bg-green-500 hover:bg-green-400 flex items-center gap-2 text-white"
        >
          <icons.IoAddCircle size={24} />
          Thiết lập Vị trí Mới
        </ButtonCustom>
      </div>
      <Modal open={isOpenModal} handleOpen={setIsOpenModal} size="sm">
        <SettingWorkPosition />
      </Modal>
    </div>
  );
};

export default CVRecomendationPage;
