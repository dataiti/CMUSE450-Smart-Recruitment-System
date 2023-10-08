import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import parse from "html-react-parser";
import { timeAgo } from "../utils/fn";
import { icons } from "../utils/icons";

const JobCard = ({
  jobItem,
  openDrawer,
  setOpenDrawer,
  handleViewJobDetail,
}) => {
  return (
    <Card
      className="bg-white !p-0 !m-0 !shadow-none !rounded-md cursor-pointer hover:opacity-90 hover:-translate-y-[2px] transition-all"
      key={jobItem?._id}
    >
      <CardBody className="w-full flex flex-col gap-2">
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
              <Typography className="flex items-center gap-2 text-sm font-medium">
                <icons.AiFillClockCircle size={18} color="#a16207" />
                {timeAgo(new Date(jobItem?.createdAt))}
              </Typography>
            </div>
          </div>
          <IconButton variant="outlined" className="">
            <icons.IoBookmark size={20} />
          </IconButton>
        </div>
        <div className="flex items-center gap-2">
          <Typography className="flex items-center gap-2 px-4 py-1 text-xs text-red-700 font-bold rounded-full bg-red-50">
            <icons.BsCalendar3 size={12} />
            {jobItem?.jobType}
          </Typography>
          <Typography className="flex items-center gap-2 px-4 py-1 text-xs text-teal-700 font-bold rounded-full bg-teal-50">
            <icons.HiLocationMarker size={14} />
            {jobItem?.workRegion?.province}
          </Typography>
        </div>
        <div className="bg-gray-100 rounded-md p-2">
          <Typography className=" text-gray-500 !text-xs name-3">
            {(jobItem.jobDescription && parse(jobItem.jobDescription)) || ""}
          </Typography>
        </div>
        <div className="flex items-center gap-1">
          {jobItem?.skills &&
            jobItem?.skills.map((skill, index) => (
              <Typography className="px-4 py-1 text-xs text-indigo-700 font-bold rounded-full bg-indigo-50">
                {skill}
              </Typography>
            ))}
        </div>
      </CardBody>
      <CardFooter className="!pt-0 mt-auto">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-[#212f3f] shadow-none hover:shadow-none !py-2">
              Ứng tuyển
            </Button>
            <Button
              className="bg-teal-900 shadow-none hover:shadow-none !py-2"
              onClick={() => {
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
  );
};

export default JobCard;
