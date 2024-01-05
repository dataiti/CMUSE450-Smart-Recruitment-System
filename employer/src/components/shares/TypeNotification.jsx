import { Avatar, Typography } from "@material-tailwind/react";
import { ButtonCustom } from "../shares";
import { icons } from "../../utils/icons";
import { Link } from "react-router-dom";
import { socket } from "../../socket";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

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

const InvitedType = ({ el = {}, setOpenModal, setListNotifications }) => {
  const { user } = useSelector(authSelect);

  useEffect(() => {});

  const handleAcceptedInterviewIntivion = async () => {
    socket?.emit("user_accepted_intiviton_CV", {
      userId: user?._id,
      employerId: el?.employerId?._id,
      applyJobId: el?.applyJobId,
      notificationId: el?._id,
    });
  };

  const handleRejectedInterviewIntivion = async () => {
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
          socket?.emit("user_cancel_intiviton_CV", {
            userId: user?._id,
            employerId: el?.employerId?._id,
            applyJobId: el?.applyJobId,
            notificationId: el?._id,
          });
          toast.success("Đã từ chối lời mới phỏng vấn !");
        }
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (socket) {
      socket.on("user_get_list_notifications", ({ message }) => {
        setListNotifications(message);
      });
    }
  }, []);

  return (
    <Link
      className="rounded-md p-2 bg-indigo-50 hover:bg-indigo-100 transition-all border border-indigo-200 flex flex-col gap-2"
      to="/schedule-interview"
    >
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
      {!el?.isViewed && (
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
      )}
    </Link>
  );
};

const SystemType = () => {
  return <div>SystemType</div>;
};

export { MessageType, InvitedType, SystemType };
