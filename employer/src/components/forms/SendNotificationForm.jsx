import React, { useState } from "react";
import {
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { ButtonCustom, SwitchCustom } from "../shares";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { socket } from "../../socket";
import { toast } from "react-toastify";
import { TextEditorController, InputController } from "../forms";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";

const schema = yup.object().shape({
  title: yup.string().required("Vui lòng nhập tiêu đề thông báo"),
  content: yup.string().required("Vui lòng nhập nội dung thông báo"),
});

const SendNotificationForm = ({
  applyJobDetailData = {},
  setOpenCVResultModal,
  applyJobId,
}) => {
  const { user } = useSelector(authSelect);

  const [isSendEmail, setIsSendEmail] = useState(true);
  const [isSendSystem, setIsSendSystem] = useState(true);

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

  return (
    <form onSubmit={handleSubmit(handleSubmitSendNotificationCVResult)}>
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
          <TextEditorController
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
              Gửi thông báo qua hệ thống
            </Typography>
          </div>
          <div className="px-10 flex items-center gap-2">
            <SwitchCustom
              _id="email"
              isChecked={isSendEmail}
              onChange={() => setIsSendEmail(!isSendEmail)}
            />
            <Typography className="text-base font-bold whitespace-no-wrap text-teal-800">
              Gửi thông báo qua Email
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
  );
};

export default SendNotificationForm;
