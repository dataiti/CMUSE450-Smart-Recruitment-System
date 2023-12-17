import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetApplyJobDetailQuery } from "../../redux/features/apis/apply";
import { authSelect } from "../../redux/features/slices/authSlice";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Avatar, Typography } from "@material-tailwind/react";
import { ButtonCustom, Loading, Modal } from "../shares";
import { InterviewIntivitionForm, SendNotificationForm } from "../forms";
import { icons } from "../../utils/icons";
import { socket } from "../../socket";
import { toast } from "react-toastify";

const ToolbarCV = () => {
  const { applyJobId } = useParams();

  const { user } = useSelector(authSelect);

  const [openCVResultModal, setOpenCVResultModal] = useState(false);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);

  const { data: applyJobDetailData, isFetching } = useGetApplyJobDetailQuery({
    userId: user?._id,
    employerId: user?.ownerEmployerId?._id
      ? user?.ownerEmployerId?._id
      : skipToken,
    applyId: applyJobId,
  });

  const handleRejectedCVEnvent = async () => {
    try {
      socket?.emit("employer_reject_CV", {
        userId: applyJobDetailData?.data?.candidateId?._id,
        employerId: user?.ownerEmployerId?._id,
        applyJobId,
      });
      toast.success("Đã gửi thông báo đến ứng viên !");
    } catch (error) {}
  };

  const handleSendInterviewIntivionCVEnvent = () => {};

  return (
    <div className="w-[620px] flex flex-col gap-3 bg-white h-[calc(100vh-60px)] border-l border-blue-gray-100 p-4">
      {isFetching && <Loading />}
      <div className="flex flex-col gap-2 items-center bg-gray-300 p-4 rounded-md">
        <div className="flex items-center gap-2">
          <Avatar
            src={applyJobDetailData?.data?.candidateId?.avatar}
            alt=""
            className="border border-blue-500 p-1 bg-blue-gray-200"
          />
          <div className="flex flex-col gap-1">
            <Typography className="font-bold text-sm">
              {applyJobDetailData?.data?.candidateId?.firstName}{" "}
              {applyJobDetailData?.data?.candidateId?.lastName}
            </Typography>
            <Typography className="text-sm text-gray-500 font-semibold">
              {applyJobDetailData?.data?.candidateId?.email}
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ButtonCustom
            className="bg-gray-400 hover:bg-gray-500 text-black flex"
            onClick={() => setOpenCVResultModal(true)}
          >
            Gửi báo báo CV
          </ButtonCustom>
          <ButtonCustom className="bg-gray-400 hover:bg-gray-500 text-black flex">
            Nhắn tin liên hệ
          </ButtonCustom>
          <Modal open={openCVResultModal} handleOpen={setOpenCVResultModal}>
            <SendNotificationForm
              applyJobDetailData={applyJobDetailData}
              setOpenCVResultModal={setOpenCVResultModal}
              applyJobId={applyJobId}
            />
          </Modal>
        </div>
      </div>
      <div className="flex items-center gap-1 justify-center">
        <ButtonCustom
          onClick={handleRejectedCVEnvent}
          className="bg-red-500 hover:bg-red-600 !px-5"
        >
          <icons.AiFillCloseCircle size={20} />
          Từ chối
        </ButtonCustom>
        <ButtonCustom
          onClick={() => setOpenScheduleModal(!openScheduleModal)}
          className="bg-green-500 hover:bg-green-600 !px-5"
        >
          <icons.BsCheckCircleFill size={20} />
          Chấp nhận & Gửi lời mời phỏng vấn
        </ButtonCustom>
      </div>
      <Modal open={openCVResultModal} handleOpen={setOpenCVResultModal}>
        <SendNotificationForm
          applyJobDetailData={applyJobDetailData}
          setOpenCVResultModal={setOpenCVResultModal}
          applyJobId={applyJobId}
        />
      </Modal>
      <Modal
        open={openScheduleModal}
        handleOpen={setOpenScheduleModal}
        size="lg"
      >
        <div className="flex flex-col gap-4 p-5">
          <Typography className="text-blue-500 font-bold text-lg uppercase text-center">
            Gửi lời mời phỏng vấn
          </Typography>
          <hr />
          <InterviewIntivitionForm
            applyJobId={applyJobId}
            setOpenModal={setOpenScheduleModal}
            handleSendInterviewIntivionCVEnvent={
              handleSendInterviewIntivionCVEnvent
            }
            userId={applyJobDetailData?.data?.candidateId?._id}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ToolbarCV;
