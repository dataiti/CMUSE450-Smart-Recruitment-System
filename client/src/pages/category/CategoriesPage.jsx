import { Breadcrumbs, Input, Typography } from "@material-tailwind/react";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { icons } from "../../utils/icons";
import { CategoryBar } from "../../components/layouts";
import { orderByOptions, sortByOptions } from "../../utils/constants";
import { useDebounce } from "../../hooks";
import { useGetListOfJobsQuery } from "../../redux/features/apis/jobApi";
import { jobSelect, setListJobs } from "../../redux/features/slices/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { JobCard } from "../../components/jobs";
import { videos } from "../../assets/videos";
import {
  ButtonCustom,
  PaginationOption,
  DrawerCustom,
  Loading,
  SelectCustom,
  JobDetailDrawer,
} from "../../components/shares";
import { authSelect } from "../../redux/features/slices/authSlice";

const CategoriesPage = () => {
  const dispatch = useDispatch();

  const { listJobs, totalPage, count } = useSelector(jobSelect);
  const { user } = useSelector(authSelect);

  const location = useLocation();

  const [industryFilter, setIndustryFilter] = useState([]);
  const [rating, setRating] = useState(0);
  const [genderFilter, setGenderFilter] = useState([]);
  const [typeJobFilter, setTypeJobFilter] = useState([]);
  const [levelFilter, setLevelFilter] = useState([]);
  const [experienceFilter, setExperienceFilter] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);
  const [salaryFrom, setSalaryFrom] = useState("_id");
  const [salaryTo, setSalaryTo] = useState("_id");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [jobDetailData, setJobDetailData] = useState({});
  const [isColumnCard, setIsColumnCard] = useState(true);
  const [isSticky, setIsSticky] = useState(false);

  const searchDebouceValue = useDebounce(search, 800);

  const { data: listJobsData, isFetching } = useGetListOfJobsQuery(
    {
      search: searchDebouceValue,
      sortBy,
      orderBy,
      page,
      limit,
      experience: JSON.stringify(experienceFilter),
      industry: JSON.stringify(industryFilter),
      jobType: JSON.stringify(typeJobFilter),
      gender: JSON.stringify(genderFilter),
      level: JSON.stringify(levelFilter),
      rating: rating,
      salaryFrom,
      salaryTo,
      candidateId: user?.candidateId?._id || "",
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paramValue = queryParams.get("category");

    if (paramValue) setIndustryFilter((prev) => [...prev, paramValue]);
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
    setLimit(!isColumnCard ? 4 : 8);
  }, [isColumnCard]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 90 ? true : false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeDrawer = () => setOpenDrawer(false);

  const clearFilters = () => {
    setIndustryFilter([]);
    setRating(0);
    setGenderFilter([]);
    setTypeJobFilter([]);
    setLevelFilter([]);
    setExperienceFilter([]);
  };

  const handleViewJobDetail = useCallback(
    ({ _id }) => {
      setJobDetailData(listJobsData?.data.find((job) => job._id === _id));
    },
    [listJobsData?.data]
  );

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
          Danh mục việc làm
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
          {/* <div className="flex gap-4 w-full p-2 rounded-md bg-gradient-to-l from-[#304352] to-[#cbd5e1]">
            <video className="w-[20%] rounded-lg" autoPlay loop>
              <source src={videos.CVSearching} type="video/mp4" />
            </video>
            <div className="w-[80%] flex flex-col gap-2">
              <Typography className="text-white font-bold text-base">
                Hệ thống Gợi ý Công việc kết hợp cả hai thuật toán:
                Collaborative Filtering và Content-Based Filtering để tạo ra một
                trải nghiệm cá nhân hóa cho ứng viên. Kết hợp 2 thuật toán trên
                lại sẽ là Hybrid Filtering, kết quả là một danh sách các công
                việc được đề xuất dựa trên sở thích và kỹ năng cá nhân của ứng
                viên, mang lại trải nghiệm gợi ý cá nhân và đa dạng trong sự
                nghiệp của họ.
              </Typography>
              <Link to="/recommender-job">
                <ButtonCustom>Xem gợi ý công việc phù hợp với bạn</ButtonCustom>
              </Link>
            </div>
          </div> */}
          <div
            className={`grid grid-cols-4 gap-2 bg-white rounded-md p-3 sticky z-20 top-[80px] ${
              isSticky ? "shadow-lg" : "shadow-none"
            }`}
          >
            <div className="col-span-2">
              <Input
                label="Nhập công việc tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={
                  isFetching && (
                    <span className="animate-spin text-gray-600">
                      <icons.BiLoaderCircle size={24} />
                    </span>
                  )
                }
              />
            </div>
            <div>
              <SelectCustom
                label="Sắp xếp theo"
                options={sortByOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e)}
              />
            </div>
            <div>
              <SelectCustom
                label="Thứ tự theo"
                options={orderByOptions}
                value={orderBy}
                onChange={(e) => setOrderBy(e)}
              />
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
              listJobs?.map((jobItem, index) => {
                return (
                  <JobCard
                    jobItem={jobItem}
                    openDrawer={openDrawer}
                    setOpenDrawer={setOpenDrawer}
                    handleViewJobDetail={handleViewJobDetail}
                    key={index}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <DrawerCustom
        open={openDrawer}
        setOpen={setOpenDrawer}
        closeDrawer={closeDrawer}
      >
        <JobDetailDrawer jobDetailData={jobDetailData} />
      </DrawerCustom>
    </div>
  );
};

export default CategoriesPage;
