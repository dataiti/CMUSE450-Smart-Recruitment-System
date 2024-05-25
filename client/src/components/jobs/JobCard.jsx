import { Typography, Button } from "@material-tailwind/react";
import parse from "html-react-parser";
import {
  formattedAmount,
  formattedProvinceNames,
  timeAgo,
} from "../../utils/fn";
import { icons } from "../../utils/icons";
import { Link } from "react-router-dom";
import { Tag, Modal, CirculeProgress } from "../shares";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  authSelect,
  setWishlists,
} from "../../redux/features/slices/authSlice";
import { useToggleWishListItemMutation } from "../../redux/features/apis/userApi";
import { ApplyJobForm, LoginForm } from "../forms";

const JobCard = ({ jobItem, setOpenDrawer, handleViewJobDetail }) => {
  const dispatch = useDispatch();

  const { user, isLoggedIn } = useSelector(authSelect);

  const [open, setOpen] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);

  const [toggleWishListItem] = useToggleWishListItemMutation();

  useEffect(() => {
    if (user?.wishlistIds && isLoggedIn) {
      setIsWishlist(
        user?.wishlistIds?.some(
          (wishlistId) => wishlistId?._id === jobItem?._id
        )
      );
    }
  }, [jobItem?._id, user?.wishlistIds, isLoggedIn]);

  return (
    <>
      <Link
        to={`/job-detail/${jobItem?._id}`}
        className="bg-white p-4 !rounded-md cursor-pointer hover:opacity-90 hover:-translate-y-[2px] transition-all"
      >
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={jobItem?.employerId?.companyLogo}
                alt={jobItem?.recruitmentTitle}
                className="border-gray-400 h-16 w-16 p-1 flex-none object-contain rounded-xl bg-white border"
              />
              <div className="flex flex-col gap-1">
                <Typography className="text-lg font-bold text-teal-900 name">
                  {jobItem?.recruitmentTitle}
                </Typography>
                <div className="flex items-center gap-1">
                  <Typography className="flex items-center gap-2 text-sm font-bold text-blue-gray-900">
                    <icons.BiSolidBuildingHouse size={18} color="#a16207" />
                    {jobItem?.employerId?.companyName}
                    {jobItem?.employerId?.isBuyedPremium && (
                      <span className="text-[#20d5ec]">
                        <icons.BsCheckCircleFill size={18} />
                      </span>
                    )}
                  </Typography>
                  •
                  <Typography className="flex items-center gap-2 text-xs font-medium">
                    <icons.AiFillClockCircle size={18} color="#a16207" />
                    {timeAgo(new Date(jobItem?.createdAt))}
                  </Typography>
                </div>
              </div>
            </div>
            {isWishlist ? (
              <span className="text-cyan-700">
                <icons.IoBookmark
                  size={26}
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsWishlist(false);
                    const response = await toggleWishListItem({
                      userId: user?._id,
                      jobId: jobItem?._id,
                    });
                    dispatch(setWishlists({ data: response?.data?.data }));
                  }}
                />
              </span>
            ) : (
              <span className="text-cyan-700">
                <icons.IoBookmarkOutline
                  size={26}
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsWishlist(true);
                    const response = await toggleWishListItem({
                      userId: user?._id,
                      jobId: jobItem?._id,
                    });
                    dispatch(setWishlists({ data: response?.data?.data }));
                  }}
                />
              </span>
            )}
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
                  )} Đến ${formattedAmount(jobItem?.salaryTo)}`
                : jobItem?.salaryType === "Từ"
                ? `Từ ${formattedAmount(jobItem?.salaryFrom)}`
                : jobItem?.salaryType === "Đến"
                ? `Đến ${formattedAmount(jobItem?.salaryTo)}`
                : "Thỏa thuận"}
            </Tag>
          </div>
          <div className="bg-gray-100 rounded-md p-2">
            <div className=" !text-gray-500 !text-xs name-3">
              {(jobItem.jobDescription && parse(jobItem.jobDescription)) || ""}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {jobItem?.skills &&
              jobItem?.skills.map((skill, index) => (
                <Tag className="text-indigo-700 bg-indigo-50 name" key={index}>
                  {skill}
                </Tag>
              ))}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button
              className="bg-[#212f3f] shadow-none hover:shadow-none !py-2"
              onClick={(e) => {
                e.preventDefault();
                if (!isLoggedIn) {
                  setIsOpenLoginModal(true);
                } else {
                  setOpen(true);
                }
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
          <CirculeProgress percentage={Number(jobItem?.percentage) || 0} />
        </div>
      </Link>
      <Modal open={open} handleOpen={() => setOpen(!open)}>
        <ApplyJobForm jobItem={jobItem} setOpen={setOpen} />
      </Modal>
      <LoginForm open={isOpenLoginModal} handleOpen={setIsOpenLoginModal} />
    </>
  );
};

export default JobCard;
