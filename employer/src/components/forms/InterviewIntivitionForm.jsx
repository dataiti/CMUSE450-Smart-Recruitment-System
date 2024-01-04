import React, { useState } from "react";
import {
  InputController,
  SelectController,
  TextEditorController,
} from "../forms";
import { ButtonCustom, Loading, SwitchCustom } from "../shares";
import { typeMeetingOptions } from "../../utils/constants";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import { toast } from "react-toastify";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { socket } from "../../socket";

const schema = yup.object().shape({
  title: yup.string().required("Tiêu đề không được bỏ trống"),
  interviewerName: yup
    .string()
    .required("Tên người phỏng vấn không được bỏ trống"),
  interviewerEmail: yup
    .string()
    .email("Địa chỉ email không hợp lệ")
    .required("Email người phỏng vấn không được bỏ trống"),
  interviewerPhoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại người phỏng vấn không được bỏ trống"),
  // scheduleDate: yup.date().required("Ngày phỏng vấn không được bỏ trống"),
  startTime: yup
    .string()
    .required("Thời gian bắt đầu phỏng vấn không được bỏ trống"),
  endTime: yup
    .string()
    .required("Thời gian kết thúc phỏng vấn không được bỏ trống"),
  location: yup.string().required("Địa điểm phỏng vấn không được bỏ trống"),
  typeMeeting: yup.string().required("Loại cuộc họp không được bỏ trống"),
  content: yup.string().required("Nội dung thư mời không được bỏ trống"),
});

const InterviewIntivitionForm = ({ applyJobId, setOpenModal, userId }) => {
  const [isSendEmail, setIsSendEmail] = useState(true);
  const [isSendSystem, setIsSendSystem] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useSelector(authSelect);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      interviewerName: "",
      interviewerEmail: "",
      interviewerPhoneNumber: "",
      scheduleDate: "",
      startTime: "",
      endTime: "",
      location: "",
      typeMeeting: "",
      content: "",
    },
    resolver: yupResolver(schema),
  });

  const handleSendInterviewIntivionCVEnvent = async (data) => {
    try {
      setIsLoading(true);
      let formatData = { ...data, applyJobId };
      for (const key in formatData) {
        if (formatData.hasOwnProperty(key)) {
          const value = formatData[key];
          try {
            const parsedValue = JSON.parse(value);

            if (parsedValue.hasOwnProperty("value")) {
              formatData[key] = parsedValue.value;
            }
          } catch (error) {}
        }
      }
      socket?.emit("employer_interview_invition_CV", {
        userId,
        employerId: user?.ownerEmployerId?._id,
        applyJobId,
        data: formatData,
      });
      setOpenModal(false);
      setIsLoading(false);
      toast.success("Đã gửi thông báo đến ứng viên !");
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <form
        className="flex flex-col gap-5 p-2 !h-[calc(100vh-150px)] overflow-y-auto"
        onSubmit={handleSubmit(handleSendInterviewIntivionCVEnvent)}
      >
        <InputController
          control={control}
          name="title"
          label="Tiêu đề"
          error={errors?.title}
        />
        <InputController
          control={control}
          name="interviewerName"
          label="Tên người phỏng vấn"
          error={errors?.interviewerName}
        />
        <InputController
          control={control}
          name="interviewerEmail"
          label="Email"
          error={errors?.interviewerEmail}
        />
        <InputController
          control={control}
          name="interviewerPhoneNumber"
          label="Số điện thoại"
          error={errors?.interviewerPhoneNumber}
        />
        <InputController
          type="date"
          control={control}
          name="scheduleDate"
          label="Ngày/tháng/năm"
          error={errors?.scheduleDate}
        />
        <InputController
          type="time"
          control={control}
          name="startTime"
          label="Thời gian bắt đầu"
          error={errors?.startTime}
        />
        <InputController
          type="time"
          control={control}
          name="endTime"
          label="Thời gian kết thúc"
          error={errors?.endTime}
        />
        <InputController
          control={control}
          name="location"
          label="Địa điểm"
          error={errors?.location}
        />
        <SelectController
          control={control}
          name="typeMeeting"
          label="Loại cuộc họp"
          options={typeMeetingOptions}
          error={errors?.typeMeeting}
        />
        <TextEditorController
          control={control}
          name="content"
          label="Nội dung lời mời"
          error={errors?.content}
        />
        <div className="px-10 flex items-center gap-2">
          <SwitchCustom
            _id="system"
            isChecked={isSendSystem}
            onChange={() => setIsSendSystem(!isSendSystem)}
          />
          <Typography className="text-base font-bold whitespace-no-wrap text-teal-800">
            Gửi thông báo lời mời qua hệ thống
          </Typography>
        </div>
        <div className="px-10 flex items-center gap-2">
          <SwitchCustom
            _id="email"
            isChecked={isSendEmail}
            onChange={() => setIsSendEmail(!isSendEmail)}
          />
          <Typography className="text-base font-bold whitespace-no-wrap text-teal-800">
            Gửi thông báo lời mời qua Email
          </Typography>
        </div>
        <div className="px-6 w-full flex justify-center">
          <ButtonCustom type="submit" className="flex">
            <icons.IoSendSharp size={24} />
            Gửi lời mời
          </ButtonCustom>
        </div>
      </form>
    </>
  );
};

export default InterviewIntivitionForm;
