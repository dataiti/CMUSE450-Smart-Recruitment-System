import React, { useState } from "react";
import PDFViewer from "../../components/PDFViewer";
import { useParams } from "react-router-dom";
import { useGetApplyJobDetailQuery } from "../../redux/features/apis/apply";
import { authSelect } from "../../redux/features/slices/authSlice";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import Loading from "../../components/Loading";
import {
  Avatar,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { formattedAmount, formattedProvinceNames } from "../../utils/fn";
import Tag from "../../components/Tag";
import ButtonCustom from "../../components/ButtonCustom";
import Modal from "../../components/Modal";
import { useForm } from "react-hook-form";
import InputController from "../../components/InputController";
import TextareaController from "../../components/TextareaController";
import SwitchCustom from "../../components/Switch";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { socket } from "../../socket";
import { toast } from "react-toastify";
import parse from "html-react-parser";

const schema = yup.object().shape({
  title: yup.string().required("Vui lòng nhập tiêu đề thông báo"),
  content: yup.string().required("Vui lòng nhập nội dung thông báo"),
});
const ResumeDetail = () => {
  const { applyJobId } = useParams();

  const { user } = useSelector(authSelect);

  const [openCVResultModal, setOpenCVResultModal] = useState(false);
  const [isSendEmail, setIsSendEmail] = useState(true);
  const [isSendSystem, setIsSendSystem] = useState(true);

  const { data: applyJobDetailData, isFetching } = useGetApplyJobDetailQuery({
    userId: user?._id,
    employerId: user?.ownerEmployerId?._id
      ? user?.ownerEmployerId?._id
      : skipToken,
    applyId: applyJobId,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      url: "",
    },
    resolver: yupResolver(schema),
  });

  const handleSubmitSendNotificationCVResult = async ({ title, content }) => {
    try {
      socket.emit("employer_send_notification", {
        userId: applyJobDetailData?.data?.candidateId?._id,
        employerId: user?.ownerEmployerId?._id,
        title,
        content,
        url: `http://localhost:3000/list-resumes/${applyJobId}`,
      });
      reset();
      toast.success("Gửi thông báo thành công");
      setOpenCVResultModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(applyJobDetailData?.data);

  return (
    <div className="">
      {isFetching && <Loading />}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-8 py-4 px-4">
          <PDFViewer url={applyJobDetailData?.data?.CVpdf} />
        </div>
        <div className="col-span-4 bg-white h-[calc(100vh-60px)] border-l border-blue-gray-100 p-4">
          <div className="flex items-center gap-2">
            <Avatar
              src={applyJobDetailData?.data?.candidateId?.avatar}
              alt=""
              className="border-2 border-cyan-500"
            />
            <div className="flex flex-col gap-1">
              <Typography className="font-bold text-sm">
                {applyJobDetailData?.data?.candidateId?.firstName}{" "}
                {applyJobDetailData?.data?.candidateId?.lastName}
              </Typography>
              <Typography className="text-gray-500 italic font-bold text-sm">
                {applyJobDetailData?.data?.candidateId?.email}
              </Typography>
            </div>
          </div>
          <hr className="my-3 border-blue-gray-100" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={applyJobDetailData?.data?.employerId?.companyLogo}
                  alt={applyJobDetailData?.data?.jobId?.recruitmentTitle}
                  className="h-14 w-14 object-contain rounded-xl bg-blue-gray-800"
                />
                <div className="flex flex-col gap-1">
                  <Typography className="text-lg font-bold text-teal-900 name">
                    {applyJobDetailData?.data?.jobId?.recruitmentTitle}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag
                className="text-red-700 bg-red-50"
                icon={<icons.BsCalendar3 size={12} />}
              >
                {applyJobDetailData?.data?.jobId?.jobType}
              </Tag>
              <Tag
                className="text-teal-700 bg-teal-50"
                icon={<icons.HiLocationMarker size={14} />}
              >
                {formattedProvinceNames(
                  applyJobDetailData?.data?.jobId?.workRegion?.province
                )}
              </Tag>
              <Tag
                className="text-amber-900 bg-amber-50"
                icon={<icons.AiFillDollarCircle size={14} />}
              >
                {applyJobDetailData?.data?.jobId?.salaryType === "Trong khoảng"
                  ? `Từ ${formattedAmount(
                      applyJobDetailData?.data?.jobId?.salaryFrom
                    )} Đến ${formattedAmount(
                      applyJobDetailData?.data?.jobId?.salaryFrom
                    )}`
                  : applyJobDetailData?.data?.jobId?.salaryType === "Từ"
                  ? `Từ ${formattedAmount(
                      applyJobDetailData?.data?.jobId?.salaryFrom
                    )}`
                  : applyJobDetailData?.data?.jobId?.salaryType === "Đến"
                  ? `Đến ${formattedAmount(
                      applyJobDetailData?.data?.jobId?.salaryFrom
                    )}`
                  : "Thỏa thuận"}
              </Tag>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {applyJobDetailData?.data?.jobId?.skills &&
                applyJobDetailData?.data?.jobId?.skills.map((skill, index) => (
                  <Tag
                    className="text-indigo-700 bg-indigo-50 flex-wrap"
                    key={index}
                  >
                    {skill}
                  </Tag>
                ))}
            </div>
          </div>
          <hr className="my-3 border-blue-gray-100" />
          <div className="text-sm font-bold p-2 bg-blue-50 rounded-lg list-disc">
            {(applyJobDetailData?.data?.jobId?.candidateRequirements &&
              parse(applyJobDetailData?.data?.jobId?.candidateRequirements)) ||
              ""}
          </div>
          <hr className="my-3 border-blue-gray-100" />
          <div>
            <div className="flex items-center gap-2">
              <ButtonCustom onClick={() => setOpenCVResultModal(true)}>
                Gửi thông báo CV
              </ButtonCustom>
              <ButtonCustom>Nhắn tin liên hệ</ButtonCustom>
            </div>
            <Modal
              open={openCVResultModal}
              handleOpen={() => setOpenCVResultModal(!openCVResultModal)}
            >
              <form
                onSubmit={handleSubmit(handleSubmitSendNotificationCVResult)}
              >
                <DialogHeader>
                  <div className="flex items-center justify-between w-full">
                    <Typography className="font-bold uppercase name text-light-blue-500">
                      Gửi phản hồi kết quả CV ứng tuyển
                    </Typography>
                    <span
                      className="hover:opacity-90 cursor-pointer transition-all"
                      onClick={() => setOpenCVResultModal(false)}
                    >
                      <icons.AiFillCloseCircle size={30} />
                    </span>
                  </div>
                </DialogHeader>
                <DialogBody divider>
                  <div className="flex flex-col gap-5">
                    <InputController
                      control={control}
                      name="title"
                      label="Tiêu đề thông báo"
                      error={errors?.title}
                      isField
                    />
                    <TextareaController
                      control={control}
                      name="content"
                      label="Nội dung thông báo"
                      error={errors?.title}
                      isField
                    />
                    <div className="px-10 flex items-center gap-2">
                      <SwitchCustom
                        _id="system"
                        isChecked={isSendSystem}
                        onChange={() => setIsSendSystem(!isSendSystem)}
                      />
                      <Typography className="text-base font-bold whitespace-no-wrap text-teal-800">
                        Gửi ứng cử viên qua hệ thống
                      </Typography>
                    </div>
                    <div className="px-10 flex items-center gap-2">
                      <SwitchCustom
                        _id="email"
                        isChecked={isSendEmail}
                        onChange={() => setIsSendEmail(!isSendEmail)}
                      />
                      <Typography className="text-base font-bold whitespace-no-wrap text-teal-800">
                        Gửi ứng cử viên qua Email
                      </Typography>
                    </div>
                  </div>
                </DialogBody>
                <DialogFooter>
                  <ButtonCustom type="submit" variant="gradient" color="green">
                    Gửi phản hồi
                  </ButtonCustom>
                </DialogFooter>
              </form>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetail;
