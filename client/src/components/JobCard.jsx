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

const JobCard = ({
  jobItem,
  openDrawer,
  setOpenDrawer,
  handleViewJobDetail,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  const handleSubmitAppliJob = ({ _id, e }) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <Link
        to={`/job-detail/${jobItem?._id}`}
        key={jobItem?._id}
        className="min-h-[288px] bg-white !rounded-md cursor-pointer hover:opacity-90 hover:-translate-y-[2px] transition-all"
      >
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
                  <Tag className="text-indigo-700 bg-indigo-50" key={index}>
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
                  onClick={(e) =>
                    handleSubmitAppliJob({ _id: jobItem?._id, e })
                  }
                  handleOpen={handleOpen}
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
      <Modal open={open} handleOpen={handleOpen}>
        <DialogHeader>
          <Typography className="font-bold uppercase name text-light-blue-500">{`Ứng tuyển ${jobItem?.recruitmentTitle}`}</Typography>
        </DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col gap-2 p-2 border border-gray-300 rounded-lg">
            <Typography className="text-sm font-bold text-teal-800">
              Lưu ý:
            </Typography>
            <Typography className="text-sm font-semibold">
              1. Ứng viên nên lựa chọn ứng tuyển bằng CV Online & viết thêm mong
              muốn tại phần thư giới thiệu để được Nhà tuyển dụng xem CV sớm
              hơn.
            </Typography>
            <Typography className="text-sm font-semibold">
              2. Để có trải nghiệm tốt nhất, bạn nên sử dụng các trình duyệt phổ
              biến như Google Chrome hoặc Firefox. SRS khuyên tất cả các bạn hãy
              luôn cẩn trọng trong quá trình tìm việc và chủ động nghiên cứu về
              thông tin công ty, vị trí việc làm trước khi ứng tuyển.
            </Typography>
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-teal-800">
                Thư giới thiệu:
              </label>
              <Textarea
                label="Thư giới thiệu"
                placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) vè nêu rõ mong muốn, lý do làm việc tại công ty này. Đây là cách gây ấn tượng với nhà tuyển dụng nếu bạn chưa có kinh nghiệm làm việc (hoặc CV không tốt)"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            Huỷ
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            Nộp CV
          </Button>
        </DialogFooter>
      </Modal>
    </>
  );
};

export default JobCard;
