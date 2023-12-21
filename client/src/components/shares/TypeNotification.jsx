import { Avatar, Typography } from "@material-tailwind/react";
import { ButtonCustom } from "../shares";
import { icons } from "../../utils/icons";

const MessageType = ({ el = {} }) => {
  return (
    <div className="rounded-md p-2 bg-orange-50/30 hover:bg-orange-100/30 border border-orange-200 flex flex-col gap-2 transition-all">
      <div className="flex items-center gap-2">
        <Avatar
          src={el?.employerId?.companyLogo}
          alt=""
          className="flex-none bg-blue-gray-600 !w-10 !h-10 object-contain !rounded-md"
        />
        <div className="flex flex-col text-start">
          <Typography className="mb-1 text-sm font-bold name text-black">
            {el?.title}
          </Typography>
          <Typography className="mb-1 text-xs font-medium name text-gray-700">
            {el?.content}
          </Typography>
        </div>
      </div>
    </div>
  );
};

const InvitedType = ({ el = {} }) => {
  const handleAcceptedInterviewIntivion = async () => {
    try {
    } catch (error) {}
  };

  const handleRejectedInterviewIntivion = async () => {
    try {
    } catch (error) {}
  };

  return (
    <div className="rounded-md p-2 bg-indigo-50 hover:bg-indigo-100 transition-all border border-indigo-200 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Avatar
          src={el?.employerId?.companyLogo}
          alt=""
          className="flex-none bg-blue-gray-600 !w-10 !h-10 object-contain !rounded-md"
        />
        <div className="flex flex-col text-start">
          <Typography className="mb-1 text-sm font-bold name text-black">
            {el?.title}
          </Typography>
          <Typography className="mb-1 text-xs font-medium name text-gray-700">
            {el?.content}
          </Typography>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <ButtonCustom
          className="text-green-500 bg-green-50 hover:bg-green-100 !w-[150px]"
          onClick={handleAcceptedInterviewIntivion}
        >
          <icons.BsCheckCircleFill size={20} />
          Chấp nhận
        </ButtonCustom>
        <ButtonCustom
          className="text-red-500 bg-red-50 hover:bg-red-100 !w-[150px]"
          onClick={handleRejectedInterviewIntivion}
        >
          <icons.IoCloseCircleSharp size={20} />
          Từ chối
        </ButtonCustom>
      </div>
    </div>
  );
};

const SystemType = () => {
  return <div>SystemType</div>;
};

export { MessageType, InvitedType, SystemType };
