import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import parse from "html-react-parser";
import { formattedAmount, formattedProvinceNames, timeAgo } from "../utils/fn";
import { icons } from "../utils/icons";
import { Link } from "react-router-dom";
import Tag from "./Tag";
import { useState } from "react";
import Modal from "./Modal";
import { Controller, useForm } from "react-hook-form";
import { useApplyJobMutation } from "../redux/features/apis/applyJobApi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { authSelect } from "../redux/features/slices/authSlice";
import Loading from "./Loading";
import IconButtonCustom from "./IconButtonCustom";

const JobCard = ({ jobItem, setOpenDrawer, handleViewJobDetail }) => {
  const dispatch = useDispatch();

  const { user } = useSelector(authSelect);

  const [open, setOpen] = useState(false);
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
    <>
      <Link
        to={`/job-detail/${jobItem?._id}`}
        key={jobItem?._id}
        className="min-h-[288px] bg-white !rounded-md cursor-pointer hover:opacity-90 hover:-translate-y-[2px] transition-all"
      >
        {isLoading && <Loading />}
        <Card className="bg-white !shadow-none flex flex-col">
          <CardBody className="w-full flex flex-col gap-2 !p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={jobItem?.employerId?.companyLogo}
                  alt={jobItem?.recruitmentTitle}
                  className="h-14 w-14 object-contain rounded-xl bg-blue-gray-800"
                />
                <div className="flex flex-col gap-1">
                  <Typography className="text-lg font-bold text-teal-900 name">
                    {jobItem?.recruitmentTitle}
                  </Typography>

                  <div className="flex items-center gap-2">
                    <Typography className="flex items-center gap-2 text-base font-bold text-blue-gray-900">
                      <icons.BiSolidBuildingHouse size={18} color="#a16207" />
                      {jobItem?.employerId?.companyName}
                    </Typography>
                    •
                    <Typography className="flex items-center gap-2 text-sm font-medium">
                      <icons.AiFillClockCircle size={18} color="#a16207" />
                      {timeAgo(new Date(jobItem?.createdAt))}
                    </Typography>
                  </div>
                </div>
              </div>
              <span className="">
                <icons.IoBookmark size={24} />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tag
                className="text-red-700 bg-red-50"
                icon={<icons.BsCalendar3 size={12} />}
              >
                {jobItem?.jobType}
              </Tag>
              <Tag
                className="text-teal-700 bg-teal-50"
                icon={<icons.HiLocationMarker size={14} />}
              >
                {formattedProvinceNames(jobItem?.workRegion?.province)}
              </Tag>
              <Tag
                className="text-amber-900 bg-amber-50"
                icon={<icons.AiFillDollarCircle size={14} />}
              >
                {jobItem?.salaryType === "Trong khoảng"
                  ? `Từ ${formattedAmount(
                      jobItem?.salaryFrom
                    )} Đến ${formattedAmount(jobItem?.salaryFrom)}`
                  : jobItem?.salaryType === "Từ"
                  ? `Từ ${formattedAmount(jobItem?.salaryFrom)}`
                  : jobItem?.salaryType === "Đến"
                  ? `Đến ${formattedAmount(jobItem?.salaryFrom)}`
                  : "Thỏa thuận"}
              </Tag>
            </div>
            <div className="bg-gray-100 rounded-md p-2">
              <div className=" !text-gray-500 !text-xs name-3">
                {(jobItem.jobDescription && parse(jobItem.jobDescription)) ||
                  ""}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {jobItem?.skills &&
                jobItem?.skills.map((skill, index) => (
                  <Tag
                    className="text-indigo-700 bg-indigo-50 name"
                    key={index}
                  >
                    {skill}
                  </Tag>
                ))}
            </div>
          </CardBody>
          <CardFooter className="!pt-0 mt-auto !p-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Button
                  className="bg-[#212f3f] shadow-none hover:shadow-none !py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                  }}
                >
                  Ứng tuyển
                </Button>
                <Button
                  className="bg-teal-900 shadow-none hover:shadow-none !py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleViewJobDetail({ _id: jobItem?._id });
                    setOpenDrawer(true);
                  }}
                >
                  Xem nhanh
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
      <Modal open={open} handleOpen={() => setOpen(!open)}>
        <form onSubmit={handleSubmit(handleSubmitAppliJob)}>
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
                1. Ứng viên nên lựa chọn ứng tuyển bằng CV Online & viết thêm
                mong muốn tại phần thư giới thiệu để được Nhà tuyển dụng xem CV
                sớm hơn.
              </Typography>
              <Typography className="text-sm font-semibold">
                2. Để có trải nghiệm tốt nhất, bạn nên sử dụng các trình duyệt
                phổ biến như Google Chrome hoặc Firefox. SRS khuyên tất cả các
                bạn hãy luôn cẩn trọng trong quá trình tìm việc và chủ động
                nghiên cứu về thông tin công ty, vị trí việc làm trước khi ứng
                tuyển.
              </Typography>
            </div>
            <div className="flex flex-col gap-2">
              <Controller
                control={control}
                name="CVpdf"
                render={({ field: { onChange } }) => (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-teal-800">
                      Chọn CV:
                    </label>
                    <label
                      htmlFor="CVpdf"
                      className="flex items-center gap-2 border border-gray-400 rounded-md px-4 py-2 w-[220px] cursor-pointer hover:bg-gray-100"
                    >
                      <icons.BsFiletypePdf size={18} />
                      <Typography className="text-sm font-bold">
                        Tải lên CV từ máy tính
                      </Typography>
                    </label>
                    <input
                      type="file"
                      id="CVpdf"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setNamePDFFile(file.name);
                        return onChange(e.target.files[0]);
                      }}
                    />
                    <Typography className="text-sm font-bold">
                      {namePDFFile}
                    </Typography>
                  </div>
                )}
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
      </Modal>
    </>
  );
};

export default JobCard;
