import { Typography } from "@material-tailwind/react";
import {
  formattedAmount,
  formattedProvinceNames,
  timeAgo,
} from "../../utils/fn";
import { icons } from "../../utils/icons";
import { Link } from "react-router-dom";
import { Tag } from "../shares";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  authSelect,
  setWishlists,
} from "../../redux/features/slices/authSlice";
import { useToggleWishListItemMutation } from "../../redux/features/apis/userApi";

const JobCardSmall = ({ jobItem, setOpenDrawer, handleViewJobDetail }) => {
  const dispatch = useDispatch();

  const { user } = useSelector(authSelect);

  const [isWishlist, setIsWishlist] = useState(false);

  const [toggleWishListItem] = useToggleWishListItemMutation();

  useEffect(() => {
    if (user?.wishlistIds) {
      setIsWishlist(
        user?.wishlistIds?.some(
          (wishlistId) => wishlistId?._id === jobItem?._id
        )
      );
    }
  }, [jobItem?._id, user?.wishlistIds]);

  return (
    <>
      <Link to={`/job-detail/${jobItem?._id}`} key={jobItem?._id} className="">
        <div className="!shadow-none flex flex-col bg-white border border-blue-gray-200 !rounded-md cursor-pointer hover:opacity-90 hover:-translate-y-[2px] transition-all">
          <div className="w-full flex flex-col gap-2 !p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={jobItem?.employerId?.companyLogo}
                  alt={jobItem?.recruitmentTitle}
                  className="border-gray-400 h-16 w-16 p-1 flex-none object-contain rounded-xl bg-white border"
                />
                <div className="flex flex-col">
                  <Typography className="text-lg font-extrabold px-2 text-teal-900 name">
                    {jobItem?.recruitmentTitle}
                  </Typography>
                  <div className="flex items-center gap-1">
                    <icons.BiSolidBuildingHouse size={18} color="#a16207" />
                    <Typography className="text-sm font-bold text-blue-gray-900 name">
                      {jobItem?.employerId?.companyName}
                    </Typography>
                  </div>
                  <Typography className="flex items-center gap-2 text-xs font-medium">
                    <icons.AiFillClockCircle size={18} color="#a16207" />
                    {timeAgo(new Date(jobItem?.createdAt))}
                  </Typography>
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
                    )} - ${formattedAmount(jobItem?.salaryFrom)}`
                  : jobItem?.salaryType === "Từ"
                  ? `Từ ${formattedAmount(jobItem?.salaryFrom)}`
                  : jobItem?.salaryType === "Đến"
                  ? `Đến ${formattedAmount(jobItem?.salaryFrom)}`
                  : "Thỏa thuận"}
              </Tag>
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
          </div>
        </div>
      </Link>
    </>
  );
};

export default JobCardSmall;
