import {
  Typography,
  Button,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useApplyJobMutation } from "../../redux/features/apis/applyJobApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { authSelect } from "../../redux/features/slices/authSlice";
import Loading from "../shares/Loading";
import { InputPDFController } from "../forms";

const ApplyJobForm = ({ jobItem, setOpen = () => {} }) => {
  const { user } = useSelector(authSelect);

  const [namePDFFile, setNamePDFFile] = useState("");

  const [applyJob, { isLoading }] = useApplyJobMutation();

  const { control, reset, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      CVpdf: "",
      information: "",
    },
  });

  const handleSubmitAppliJob = async (data) => {
    try {
      let formData = new FormData();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }
      const response = await applyJob({
        data: formData,
        userId: user?._id,
        jobId: jobItem?._id,
        employerId: jobItem?.employerId?._id,
      });
      if (response && response.data && response.data.success) {
        setOpen(false);
        reset();
        setNamePDFFile("");
        toast.success("Đã ứng tuyển thành công !");
      }
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitAppliJob)}>
      {isLoading && <Loading />}
      <DialogHeader>
        <div className="flex items-center justify-between w-full">
          <Typography className="font-bold uppercase name text-light-blue-500">{`Ứng tuyển ${jobItem?.recruitmentTitle}`}</Typography>
          <span
            className="hover:opacity-90 cursor-pointer transition-all"
            onClick={() => setOpen(false)}
          >
            <icons.AiFillCloseCircle size={30} />
          </span>
        </div>
      </DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col gap-2 p-2 border border-gray-300 rounded-lg">
          <Typography className="text-sm font-bold text-teal-800">
            Lưu ý:
          </Typography>
          <Typography className="text-sm font-semibold">
            1. Ứng viên nên lựa chọn ứng tuyển bằng CV Online & viết thêm mong
            muốn tại phần thư giới thiệu để được Nhà tuyển dụng xem CV sớm hơn.
          </Typography>
          <Typography className="text-sm font-semibold">
            2. Để có trải nghiệm tốt nhất, bạn nên sử dụng các trình duyệt phổ
            biến như Google Chrome hoặc Firefox. SRS khuyên tất cả các bạn hãy
            luôn cẩn trọng trong quá trình tìm việc và chủ động nghiên cứu về
            thông tin công ty, vị trí việc làm trước khi ứng tuyển.
          </Typography>
        </div>
        <div className="flex flex-col gap-2">
          <InputPDFController
            control={control}
            namePDFFile={namePDFFile}
            name="CVpdf"
            setNamePDFFile={setNamePDFFile}
            isField
          />
          <Controller
            control={control}
            name="information"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-teal-800">
                  Thư giới thiệu:
                </label>
                <Textarea
                  label="Thư giới thiệu"
                  placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) vè nêu rõ mong muốn, lý do làm việc tại công ty này. Đây là cách gây ấn tượng với nhà tuyển dụng nếu bạn chưa có kinh nghiệm làm việc (hoặc CV không tốt)"
                  {...field}
                />
              </div>
            )}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button type="submit" variant="gradient" color="green">
          Nộp CV
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ApplyJobForm;
