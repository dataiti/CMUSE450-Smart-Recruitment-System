import { Breadcrumbs, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CategoryBar from "../../components/CategoryBar";
import { useGetListOfJobsQuery } from "../../redux/features/apis/jobApi";
import { jobSelect, setListJobs } from "../../redux/features/slices/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import PaginationOption from "../../components/PaginationOption";
import JobCard from "../../components/JobCard";
import { videos } from "../../assets/videos";

const SearchPage = () => {
  const dispatch = useDispatch();

  const { listJobs, totalPage, count } = useSelector(jobSelect);

  const location = useLocation();

  const [industryFilter, setIndustryFilter] = useState([]);
  const [rating, setRating] = useState(0);
  const [genderFilter, setGenderFilter] = useState([]);
  const [typeJobFilter, setTypeJobFilter] = useState([]);
  const [levelFilter, setLevelFilter] = useState([]);
  const [experienceFilter, setExperienceFilter] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [isColumnCard, setIsColumnCard] = useState(true);
  const [keyword, setKeyWord] = useState("");

  const { data: listJobsData, isFetching } = useGetListOfJobsQuery(
    {
      search: keyword,
      page,
      limit,
      experience: JSON.stringify(experienceFilter),
      industry: JSON.stringify(industryFilter),
      jobType: JSON.stringify(typeJobFilter),
      gender: JSON.stringify(genderFilter),
      level: JSON.stringify(levelFilter),
      rating: rating,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paramValue = queryParams.get("keyword");

    if (paramValue) setKeyWord(paramValue);
  }, [location.search]);

  useEffect(() => {
    if (listJobsData && listJobsData.success) {
      dispatch(
        setListJobs({
          data: listJobsData.data,
          totalPage: listJobsData.totalPage,
          currentPage: listJobsData.currentPage,
          count: listJobsData.count,
        })
      );
    }
  }, [dispatch, listJobsData]);

  useEffect(() => {
    setLimit(!isColumnCard ? 5 : 10);
  }, [isColumnCard]);

  const clearFilters = () => {
    setIndustryFilter([]);
    setRating(0);
    setGenderFilter([]);
    setTypeJobFilter([]);
    setLevelFilter([]);
    setExperienceFilter([]);
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleCheckboxChangeByType = ({ type, value }) => {
    switch (type) {
      case "industry":
        return setIndustryFilter((prev) =>
          prev?.includes(value)
            ? prev?.filter((item) => item !== value)
            : [...prev, value]
        );
      case "sex":
        return setGenderFilter((prev) =>
          prev?.includes(value)
            ? prev?.filter((item) => item !== value)
            : [...prev, value]
        );
      case "jobType":
        return setTypeJobFilter((prev) =>
          prev?.includes(value)
            ? prev?.filter((item) => item !== value)
            : [...prev, value]
        );
      case "level":
        return setLevelFilter((prev) =>
          prev?.includes(value)
            ? prev?.filter((item) => item !== value)
            : [...prev, value]
        );
      case "experience":
        return setExperienceFilter((prev) =>
          prev?.includes(value)
            ? prev?.filter((item) => item !== value)
            : [...prev, value]
        );
      default:
        break;
    }
  };

  return (
    <div className="px-[110px] py-[20px] flex flex-col gap-2">
      {isFetching && <Loading />}
      <Breadcrumbs fullWidth className="bg-white">
        <Link to="/" className="text-light-blue-500 text-sm font-bold">
          Trang chủ
        </Link>
        <Link to="/categories-job" className="font-bold text-sm">
          Tìm kiếm công việc với từ khoá: "{keyword}"
        </Link>
      </Breadcrumbs>
      <div className="w-full flex gap-2">
        <div className="w-[24%] bg-white rounded-md">
          <CategoryBar
            industryFilter={industryFilter}
            rating={rating}
            typeJobFilter={typeJobFilter}
            genderFilter={genderFilter}
            levelFilter={levelFilter}
            handleCheckboxChangeByType={handleCheckboxChangeByType}
            setRating={setRating}
            clearFilters={clearFilters}
            experienceFilter={experienceFilter}
          />
        </div>
        <div className="w-[76%] flex flex-col gap-2">
          <div className="flex gap-4 w-full p-2 rounded-md bg-gradient-to-l from-[#304352] to-[#cbd5e1]">
            <video className="w-[20%] rounded-lg" autoPlay loop>
              <source src={videos.CVSearching} type="video/mp4" />
            </video>
            <div className="w-[80%]">
              <Typography className="text-white font-bold text-base">
                Chào mừng bạn đến với Trang Tìm Kiếm Công Việc - nơi kết nối ước
                mơ và cơ hội! Tại đây, chúng tôi không chỉ là cổng thông tin về
                hàng ngàn cơ hội việc làm mà còn là điểm hẹn của những cá nhân
                đam mê và doanh nghiệp đổi mới.Dù bạn là người tìm kiếm công
                việc hay đang muốn mở rộng đội ngũ nhân sự, hãy bắt đầu hành
                trình sự nghiệp của bạn tại đây. Hãy khám phá, ứng tuyển, và đặt
                dấu ấn của mình trong thế giới việc làm đầy thách thức này!
              </Typography>
            </div>
          </div>
          <PaginationOption
            count={count}
            handlePageChange={handlePageChange}
            isColumnCard={isColumnCard}
            page={page}
            setIsColumnCard={setIsColumnCard}
            totalPage={totalPage}
          />
          <div
            className={`${
              isColumnCard ? "grid grid-cols-2" : "flex flex-col"
            } gap-2`}
          >
            {listJobs?.length > 0 &&
              listJobs?.map((jobItem) => {
                return <JobCard jobItem={jobItem} key={jobItem?._id} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
