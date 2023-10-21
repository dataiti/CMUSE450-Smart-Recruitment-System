import {
  Breadcrumbs,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { icons } from "../../utils/icons";
import CategoryBar from "../../components/CategoryBar";
import { orderByOptions, sortByOptions } from "../../utils/constants";
import SelectCustom from "../../components/SelectCustom";
import parse from "html-react-parser";
import { useDebounce } from "../../hooks";
import { useGetListOfJobsQuery } from "../../redux/features/apis/jobApi";
import { jobSelect, setListJobs } from "../../redux/features/slices/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import JobCard from "../../components/JobCard";
import Loading from "../../components/Loading";
import DrawerCustom from "../../components/DrawerCustom";
import ReactPaginate from "react-paginate";

const CategoriesPage = () => {
  const dispatch = useDispatch();

  const { listJobs, totalPage, count } = useSelector(jobSelect);

  const [industryFilter, setIndustryFilter] = useState([]);
  const [rating, setRating] = useState(0);
  const [genderFilter, setGenderFilter] = useState([]);
  const [typeJobFilter, setTypeJobFilter] = useState([]);
  const [levelFilter, setLevelFilter] = useState([]);
  const [experienceFilter, setExperienceFilter] = useState([]);
  const [sortBy, setSortBy] = useState("asc");
  const [orderBy, setOrderBy] = useState("_id");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
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
    },
    { refetchOnMountOrArgChange: true }
  );

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
        <Link to="/categorycategories-job" className="font-bold text-sm">
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
          <div className="flex items-center justify-between">
            <Typography className="flex items-center gap-2 font-bold text-light-blue-600">
              <icons.FiSearch size={18} /> Tìm thấy {count} công việc
            </Typography>
            <div className="flex items-center gap-2">
              {isColumnCard ? (
                <IconButton
                  className="shadow-none bg-white text-[#212f3f] !p-5 !rounded-md"
                  onClick={() => setIsColumnCard(false)}
                >
                  <icons.FaBars size={24} />
                </IconButton>
              ) : (
                <IconButton
                  className="shadow-none bg-white text-[#212f3f] !p-5 !rounded-md"
                  onClick={() => setIsColumnCard(true)}
                >
                  <icons.FaGripVertical size={24} />
                </IconButton>
              )}
              <div className="bg-white p-1 rounded-md ">
                <ReactPaginate
                  pageCount={totalPage}
                  onPageChange={handlePageChange}
                  forcePage={page - 1}
                  containerClassName={"pagination"}
                  nextLabel={<icons.IoArrowRedoCircleOutline size={36} />}
                  previousLabel={<icons.IoArrowUndoCircleOutline size={36} />}
                  activeClassName="!bg-[#212f3f] text-white text-gray-700 py-1 px-3 rounded-sm"
                  pageClassName="bg-gray-200 text-gray-700 py-1 px-3 rounded-sm"
                  className="flex items-center gap-2 text-gray-700"
                />
              </div>
            </div>
          </div>
          <div
            className={`${
              isColumnCard ? "grid grid-cols-2" : "flex flex-col"
            } gap-2`}
          >
            {listJobs?.length > 0 &&
              listJobs?.map((jobItem) => {
                return (
                  <JobCard
                    jobItem={jobItem}
                    openDrawer={openDrawer}
                    setOpenDrawer={setOpenDrawer}
                    handleViewJobDetail={handleViewJobDetail}
                    key={jobItem?._id}
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
        <div className="flex flex-col gap-1">
          <div className="flex flex-col bg-white rounded-md ">
            <Typography className="uppercase text-[#212f3f] font-bold text-lg">
              {jobDetailData?.recruitmentTitle}
            </Typography>
            <div className="grid grid-cols-3">
              <div className="flex items-center gap-2">
                <IconButton className="rounded-full bg-[#fde68a]">
                  <icons.AiFillDollarCircle size={30} />
                </IconButton>
                <div className="flex flex-col gap-2">
                  <Typography className="text-sm">Mức lương</Typography>
                  <Typography className="text-xs">
                    {jobDetailData?.experience}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconButton className="rounded-full bg-[#fde68a]">
                  <icons.HiLocationMarker size={30} />
                </IconButton>
                <div className="flex flex-col gap-2">
                  <Typography>Địa điểm</Typography>
                  <Typography className="text-xs">
                    {jobDetailData?.workRegion?.province}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconButton className="rounded-full bg-[#fde68a]">
                  <icons.AiFillClockCircle size={30} />
                </IconButton>
                <div className="flex flex-col gap-2">
                  <Typography>Kinh nghiệm</Typography>
                  <Typography className="text-xs">
                    {jobDetailData?.experience}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-whi rounded-md ">
            <Typography className="border-b-4 border-[#164e63] font-bold uppercase text-sm pb-1">
              Mô tả công việc
            </Typography>
            <div className="text-sm py-2">
              {(jobDetailData.jobDescription &&
                parse(jobDetailData.jobDescription)) ||
                ""}
            </div>
          </div>
          <div className="bg-whi rounded-md ">
            <Typography className="border-b-4 border-[#164e63] font-bold uppercase text-sm pb-1">
              Yêu cầu ứng viên
            </Typography>
            <div className="text-sm py-2">
              {(jobDetailData.candidateRequirements &&
                parse(jobDetailData.candidateRequirements)) ||
                ""}
            </div>
          </div>
          <div className="bg-whi rounded-md ">
            <Typography className="border-b-4 border-[#164e63] font-bold uppercase text-sm pb-1">
              Phúc lợi ứng viên
            </Typography>
            <div className="text-sm py-2">
              {(jobDetailData.candidateBenefits &&
                parse(jobDetailData.candidateBenefits)) ||
                ""}
            </div>
          </div>
        </div>
      </DrawerCustom>
    </div>
  );
};

export default CategoriesPage;
