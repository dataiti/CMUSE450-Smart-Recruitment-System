import React, { useEffect } from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import { useState } from "react";
import {
  Modal,
  ProgressCustom,
  CirculeProgress,
  ButtonCustom,
  EvaluateSuitableCandidate,
  BoxChat,
} from "../shares";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import { icons } from "../../utils/icons";
import { socket } from "../../socket";

const CandidateCard = ({ data = {}, workPositionRequire = {} }) => {
  const { user } = useSelector(authSelect);

  const [openEvaluateJobModal, setOpenEvaluateJobModal] = useState(false);
  const [isBoxChatOpen, setIsBoxChatOpen] = useState(false);
  const [isBoxChatBubble, setIsBoxChatBubble] = useState(false);

  const handleStartConversation = () => {
    setIsBoxChatOpen(true);
    setIsBoxChatBubble(false);
    socket?.emit("start_conversation", {
      employerId: user?.ownerEmployerId?._id,
      userId: data?.userId?._id,
    });
  };

  return (
    <>
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
      {data?.isPassed && (
        <div className="flex flex-col gap-2 px-3 pb-3 rounded-md bg-white transition-all hover:-translate-y-1 cursor-pointer">
          <ProgressCustom value={data?.totalScore} />
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar
                src={data?.userId?.avatar}
                alt=""
                className="h-16 w-16 p-1 bg-blue-gray-100 flex-none"
              />
              <div className="absolute top-1 -right-1 w-4 h-4 bg-green-400 border border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <Typography className="text-sm font-bold">
                {data?.userId?.lastName} {data?.userId?.firstName}
              </Typography>
              <Typography className="text-xs font-semibold text-gray-700">
                {data?.userId?.email}
              </Typography>
              <Typography className="text-xs font-semibold text-gray-700">
                Kinh nghiệm: {data?.experience}
              </Typography>
              <Typography className="text-xs font-semibold text-gray-700">
                Luong mong muôn: {data?.desiredSalary}
              </Typography>
              <Link
                className="text-xs font-bold text-blue-500 hover:underline"
                to={data?.CVpdf}
                isBlank
              >
                Xem CV
              </Link>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <ButtonCustom
                className="px-3"
                onClick={() => setOpenEvaluateJobModal(true)}
              >
                <icons.PiChartDonutFill size={18} />
                Độ phù hợp
              </ButtonCustom>
              <ButtonCustom className="px-3" onClick={handleStartConversation}>
                <icons.BsMessenger size={18} />
                Liên hệ
              </ButtonCustom>
            </div>
            <CirculeProgress
              className="h-[45px] w-[45px] mb-2"
              percentage={data?.totalScore}
            />
          </div>
        </div>
      )}
      <Modal
        open={openEvaluateJobModal}
        handleOpen={() => setOpenEvaluateJobModal(!openEvaluateJobModal)}
        size="lg"
      >
        <EvaluateSuitableCandidate
          setOpen={setOpenEvaluateJobModal}
          userId={user?._id}
          employerId={user?.ownerEmployerId?._id}
          candidateId={data?._id}
          workPositionRequireId={workPositionRequire?._id}
        />
      </Modal>
    </>
  );
};

export default CandidateCard;
