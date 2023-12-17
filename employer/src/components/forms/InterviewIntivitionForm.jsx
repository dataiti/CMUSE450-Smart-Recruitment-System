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
import { useCreateScheduleMutation } from "../../redux/features/apis/scheduleApi";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import { toast } from "react-toastify";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { socket } from "../../socket";

const schema = yup.object().shape({});

const InterviewIntivitionForm = ({ applyJobId, setOpenModal, userId }) => {
  const [isSendEmail, setIsSendEmail] = useState(true);
  const [isSendSystem, setIsSendSystem] = useState(true);

  const [createSchedule, { isLoading }] = useCreateScheduleMutation();

  const { user } = useSelector(authSelect);

  const {
    control,
    handleSubmit,
    reset,
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
    },
    resolver: yupResolver(schema),
  });

  const handleSendInterviewIntivionCVEnvent = async (data) => {
    try {
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
      // toast.success("Đã gửi thông báo đến ứng viên !");
      // const response = await createSchedule({
      //   data: formatData,
      //   userId: user?._id,
      //   employerId: user?.ownerEmployerId?._id,
      // });
      // if (response && response.data && response.data.success) {
      //   toast.success("Tạo lịch phỏng vấn thành công !");
      //   reset();
      //   setOpenModal(false);
      // }
    } catch (error) {}
  };

  return (
    <>
      {isLoading && <Loading />}
      <form
        className="flex flex-col gap-3 p-2 !h-[calc(100vh-150px)] overflow-y-auto"
        onSubmit={handleSubmit(handleSendInterviewIntivionCVEnvent)}
      >
        <InputController control={control} name="title" label="Tiêu đề" />
        <InputController
          control={control}
          name="interviewerName"
          label="Tên người phỏng vấn"
        />
        <InputController
          control={control}
          name="interviewerEmail"
          label="Email"
        />
        <InputController
          control={control}
          name="interviewerPhoneNumber"
          label="Số điện thoại"
        />
        <InputController
          type="date"
          control={control}
          name="scheduleDate"
          label="Ngày/tháng/năm"
        />
        <InputController
          type="time"
          control={control}
          name="startTime"
          label="Thời gian bắt đầu"
        />
        <InputController
          type="time"
          control={control}
          name="endTime"
          label="Thời gian kết thúc"
        />
        <InputController control={control} name="location" label="Địa điểm" />
        <SelectController
          control={control}
          name="typeMeeting"
          label="Loại cuộc họp"
          options={typeMeetingOptions}
        />
        <TextEditorController
          control={control}
          name="content"
          label="Nội dung lời mời"
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
