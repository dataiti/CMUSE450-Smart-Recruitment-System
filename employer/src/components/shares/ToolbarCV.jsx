import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { Avatar, Drawer, Typography } from "@material-tailwind/react";

import { useGetApplyJobDetailQuery } from "../../redux/features/apis/apply";
import { authSelect } from "../../redux/features/slices/authSlice";
import { InterviewIntivitionForm, SendNotificationForm } from "../forms";
import { icons } from "../../utils/icons";
import { socket } from "../../socket";
import { JobDetail } from "../../pages";
import { statusApplyJobOptions } from "../../utils/constants";
import {
  BoxChat,
  ButtonCustom,
  EvaluateSuitableCV,
  JobStatusBadge,
  Loading,
  Modal,
} from "../shares";

const ToolbarCV = () => {
  const { applyJobId } = useParams();

  const { user } = useSelector(authSelect);

  const [isBoxChatOpen, setIsBoxChatOpen] = useState(false);
  const [isBoxChatBubble, setIsBoxChatBubble] = useState(false);

  const [openCVResultModal, setOpenCVResultModal] = useState(false);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [openEvaluateCV, setOpenEvaluateCV] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  const { data: applyJobDetailData, isFetching } = useGetApplyJobDetailQuery({
    userId: user?._id,
    employerId: user?.ownerEmployerId?._id,
    applyId: applyJobId,
  });

  useEffect(() => {
    socket?.on("employer_get_status_apply_job", handleGetStatusApplyJob);

    return () => {
      socket?.off("employer_get_status_apply_job", handleGetStatusApplyJob);
    };
  }, []);

  const handleGetStatusApplyJob = (data) => {
    if (data.success) {
      setStatus(data.message);
    }
  };

  const handleStartConversation = () => {
    setIsBoxChatOpen(true);
    setIsBoxChatBubble(false);
    try {
      socket?.emit("start_conversation", {
        employerId: user?.ownerEmployerId?._id,
        userId: applyJobDetailData?.data?.candidateId?._id,
      });
    } catch (error) {}
  };

  const handleRejectedCVEnvent = async () => {
    try {
      Swal.fire({
        title: "Bạn có chắc không ?",
        text: "Bạn sẽ không thể hoàn tác điều này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0B5345 ",
        cancelButtonColor: "#A93226",
        confirmButtonText: "Vâng, Từ chối!",
        cancelButtonText: "Huỷ",
      }).then(async (result) => {
        if (result.isConfirmed) {
          socket?.emit("employer_reject_CV", {
            userId: applyJobDetailData?.data?.candidateId?._id,
            employerId: user?.ownerEmployerId?._id,
            applyJobId,
          });
          toast.success("Đã gửi thông báo đến ứng viên !");
        }
      });
    } catch (error) {}
  };

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const handleChangeStatusEvent = () => {
    try {
      socket?.emit("update_status_apply_job", {
        userId: applyJobDetailData?.data?.candidateId?._id,
        employerId: user?.ownerEmployerId?._id,
        applyJobId,
        status,
      });
    } catch (error) {}
  };

  return (
    <div className="w-[520px] flex flex-col gap-3 bg-white h-[calc(100vh-60px)] overflow-y-auto border-l border-blue-gray-100 p-4">
      {isFetching && <Loading />}
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
          className="h-14 w-14 flex items-center justify-center rounded-full bg-[#212f3f] text-light-blue-600 fixed bottom-5 right-5 shadow-2xl z-40"
          onClick={() => {
            setIsBoxChatBubble(false);
            setIsBoxChatOpen(true);
          }}
        >
          <icons.BsMessenger size={28} />
        </button>
      )}
      <div className="flex items-center gap-1 justify-center">
        <ButtonCustom
          onClick={handleRejectedCVEnvent}
          className="bg-red-50 text-red-500 hover:bg-red-100 !px-2"
        >
          <icons.AiFillCloseCircle size={20} />
          Từ chối
        </ButtonCustom>
        <ButtonCustom
          onClick={() => setOpenScheduleModal(!openScheduleModal)}
          className="bg-green-50 text-green-500 hover:bg-green-100 !px-2"
        >
          <icons.BsCheckCircleFill size={20} />
          Chấp nhận & Gửi lời mời phỏng vấn
        </ButtonCustom>
      </div>
      <div className="flex flex-col gap-2 p-2 border rounded-md">
        <div className="flex gap-2">
          <Avatar
            src={applyJobDetailData?.data?.candidateId?.avatar}
            alt=""
            className="h-14 w-14 p-1 bg-blue-gray-200"
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
          <ButtonCustom onClick={() => openDrawer()}>
            <icons.IoBriefcase />
            Mô tả công việc
          </ButtonCustom>
          <ButtonCustom onClick={handleStartConversation}>
            <icons.BsMessenger />
            Nhắn tin
          </ButtonCustom>
          <Modal open={openCVResultModal} handleOpen={setOpenCVResultModal}>
            <SendNotificationForm
              applyJobDetailData={applyJobDetailData}
              setOpenCVResultModal={setOpenCVResultModal}
              applyJobId={applyJobId}
            />
          </Modal>
        </div>
        <hr className="bg-gray-600" />
        <div className="flex flex-col gap-2 w-full">
          <Typography className="text-sm text-blue-500 font-bold">
            Trạng thái CV
          </Typography>
          <table className="border-2 w-full">
            <tbody>
              <tr className="border-2">
                <td className="border-2 border-gray-300 px-2 py-1 text-sm font-bold">
                  Trạng thái
                </td>
                <td className="border-2 border-gray-300 px-2 py-1">
                  <JobStatusBadge
                    status={status || applyJobDetailData?.data?.status}
                  />
                </td>
              </tr>
              <tr className="border-2">
                <td className="border-2 border-gray-300 px-2 py-1 text-sm font-bold">
                  <select
                    className="bg-white w-full"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {statusApplyJobOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border-2 border-gray-300 px-2 py-1">
                  <div className="flex justify-center">
                    <ButtonCustom
                      className="bg-gray-400 hover:bg-gray-500 text-black"
                      onClick={() => handleChangeStatusEvent()}
                    >
                      Đổi
                    </ButtonCustom>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ButtonCustom className="" onClick={() => setOpenEvaluateCV(true)}>
        <icons.PiChartDonutFill size={20} />
        Xem độ phù hợp
      </ButtonCustom>
      <Drawer
        placement="right"
        size={700}
        open={open}
        onClose={closeDrawer}
        className="p-4 bg-[#e8edf2] h-[calc(100vh-200px)] overflow-auto"
        transition={{ type: "spring", duration: 0.5 }}
      >
        <JobDetail jobDetailData={applyJobDetailData?.data?.jobId} />
      </Drawer>
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
            userId={applyJobDetailData?.data?.candidateId?._id}
          />
        </div>
      </Modal>
      <Modal open={openEvaluateCV} handleOpen={setOpenEvaluateCV} size="lg">
        <EvaluateSuitableCV applyJobData={applyJobDetailData} />
      </Modal>
    </div>
  );
};

export default ToolbarCV;
