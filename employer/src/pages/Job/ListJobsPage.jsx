import React, { useCallback, useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  jobSelect,
  removeJobItem,
  setListJobs,
  updateHiringStatusJob,
} from "../../redux/features/slices/jobSlice";
import {
  useDeleteJobMutation,
  useGetListOfJobsForEmployerQuery,
  useToggleHiringStatusJobMutation,
} from "../../redux/features/apis/jobApi";
import { authSelect } from "../../redux/features/slices/authSlice";
import parse from "html-react-parser";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import {
  desiredSalaryOptions,
  experiens,
  statusOptions,
  tableHeadJob,
} from "../../utils/constants";
import { covertToDate } from "../../utils/fn";
import {
  Button,
  Drawer,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import SwitchCustom from "../../components/Switch";
import SelectCustom from "../../components/SelectCustom";
import { useDebounce } from "../../hooks";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { icons } from "../../utils/icons";

const ListJobsPage = () => {
  const dispatch = useDispatch();

  const { listJobs, totalPage } = useSelector(jobSelect);
  const { user } = useSelector(authSelect);

  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("_id");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [experienceSelected, setExperienceSelected] = useState("");
  const [statusJobSelected, setStatusJobSelected] = useState("");
  const [jobDetailData, setJobDetailData] = useState({});

  const debouncedValue = useDebounce(search, 500);

  const [open, setOpen] = useState(false);

  const { data: listJobsData } = useGetListOfJobsForEmployerQuery(
    {
      userId: user?._id,
      employerId: user?.ownerEmployerId?._id
        ? user?.ownerEmployerId?._id
        : skipToken,
      search: debouncedValue,
      sortBy,
      orderBy,
      page,
      limit,
      experience: experienceSelected,
      status: statusJobSelected,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [toggleHiringStatusJob] = useToggleHiringStatusJobMutation();
  const [deleteJob] = useDeleteJobMutation();

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

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleViewJobDetail = useCallback(
    ({ _id }) => {
      openDrawer();
      setJobDetailData(listJobsData.data.find((job) => job._id === _id));
    },
    [listJobsData?.data]
  );

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleSelectedExperience = (e) => {
    setExperienceSelected(e);
  };

  const handleSelectedStatusJob = (e) => {
    setStatusJobSelected(e);
  };

  const handleRemoveJobItem = async ({ _id, addressId }) => {
    try {
      const response = await deleteJob({
        userId: user?._id,
        employerId: user?.ownerEmployerId?._id,
        jobId: _id,
        addressId,
      });

      if (response && response.data && response.data.success) {
        dispatch(removeJobItem({ _id }));
        setOpen(false);
        toast.success("Xoá tin tuyển dụng thành công !");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleSwitchStatustJob = async ({ _id }) => {
    try {
      const response = await toggleHiringStatusJob({
        userId: user?._id,
        employerId: user?.ownerEmployerId?._id,
        jobId: _id,
      });

      if (response && response.data && response.data.success) {
        dispatch(updateHiringStatusJob(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-[30px] my-[30px]">
      <div className="flex flex-col gap-2 bg-white p-2 rounded-md">
        <div className="flex items-center gap-3">
          <SelectCustom label="Sắp xếp theo" options={desiredSalaryOptions} />
          <SelectCustom label="Thứ tự" options={desiredSalaryOptions} />
          <SelectCustom label="Mức lương" options={desiredSalaryOptions} />
          <SelectCustom
            label="Trạng thái"
            options={statusOptions}
            value={statusJobSelected}
            onChange={handleSelectedStatusJob}
          />
          <SelectCustom
            label="Kinh nghiệm"
            options={experiens}
            value={experienceSelected}
            onChange={handleSelectedExperience}
          />
        </div>
        <div className="flex items-center gap-3">
          <Input
            label="Tìm kiếm vị trí tuyển dụng"
            value={search}
            onChange={handleChangeSearch}
          />
          <Link to="/create-recruitment-job">
            <Button className="capitalize bg-[#164e63] whitespace-nowrap">
              Thêm tin tuyển dụng
            </Button>
          </Link>
        </div>
        <div className="">
          <table className="w-full text-sm text-left cursor-pointer border border-blue-gray-100 !rounded-md">
            <thead className="text-xs  text-[#212f3f] bg-blue-gray-100 uppercase border-b border-blue-gray-100">
              <tr>
                {tableHeadJob.map(({ id, name }) => {
                  return (
                    <th
                      key={id}
                      scope="col"
                      className="px-6 py-3 text-xs text-center"
                    >
                      {name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {listJobs?.length > 0 &&
                listJobs.map((job, index) => {
                  return (
                    <tr
                      className="bg-white border-b border-blue-gray-100 hover:bg-gray-100 "
                      key={job?._id || index}
                    >
                      <td className="px-2 text-sm py-3 text-blue-gray-800">
                        <SwitchCustom
                          _id={job?._id}
                          isChecked={job?.isHiring}
                          onChange={() =>
                            handleToggleSwitchStatustJob({ _id: job?._id })
                          }
                        />
                      </td>
                      <td className="px-2 text-sm py-3 text-blue-gray-800 whitespace-nowrap">
                        ... {job?._id.slice(-4)}
                      </td>
                      <td className="px-2 text-sm py-3 text-blue-gray-800 min-w-[100px]">
                        {job?.recruitmentCampaignName}
                      </td>
                      <td className="px-2 text-sm py-3 text-blue-gray-800">
                        {job?.recruitmentTitle.slice(0, 25)}
                      </td>
                      <td className="px-2 text-sm py-3 text-blue-gray-800">
                        {job?.industry}
                      </td>
                      <td className="px-2 text-sm py-3 text-center text-blue-gray-800">
                        {job?.appliedIds?.length}
                      </td>
                      <td className="px-2  py-3 text-center text-blue-gray-800">
                        {job.status === "pending" ? (
                          <div className="p-2 rounded-md text-[10px] bg-blue-50 text-blue-500">
                            Chờ phê duyệt
                          </div>
                        ) : job.status === "active" ? (
                          <div className="p-2 rounded-md text-[10px] bg-green-50 text-green-500">
                            Đang hoạt động
                          </div>
                        ) : job.status === "expired" ? (
                          <div className="p-2 rounded-md text-[10px] bg-yellow-50 text-yellow-500">
                            Đã hết hạn
                          </div>
                        ) : (
                          <div className="p-2 rounded-md text-[10px] bg-red-50 text-red-500">
                            Bị từ chối
                          </div>
                        )}
                      </td>
                      <td className="px-2 text-sm py-3 text-center text-blue-gray-800">
                        {covertToDate(job?.createdAt)}
                      </td>
                      <td className="px-1 text-sm py-3 text-blue-gray-800">
                        <Button
                          variant="filled"
                          // onClick={openDrawer}
                          onClick={() => handleViewJobDetail({ _id: job?._id })}
                          className="text-xs capitalize font-normal rounded-full !px-4 !py-3"
                        >
                          Xem thêm
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="">
          <Pagination
            totalPage={totalPage}
            handlePageChange={handlePageChange}
            page={page}
            limit={limit}
            setLimit={setLimit}
          />
        </div>
      </div>
      <Drawer
        placement="right"
        size={700}
        open={open}
        onClose={closeDrawer}
        className="p-4 bg-[#e8edf2] h-[calc(100vh-200px)] overflow-auto"
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="w-full bg-white rounded-md fixed top-0 z-20">
          <div className="w-full flex items-center gap-3 p-4">
            <Button
              className="bg-[#7f1d1d] capitalize ro"
              onClick={() =>
                handleRemoveJobItem({
                  _id: jobDetailData?._id,
                  addressId: jobDetailData?.workRegion?._id,
                })
              }
            >
              Xoá
            </Button>
            <Button className="bg-[#164e63] capitalize">Chỉnh sửa</Button>
            <Button className="bg-[#134e4a] capitalize">
              Danh sách CV ứng tuyển
            </Button>
            <Button
              className="bg-[#374151] capitalize"
              onClick={() => setOpen(false)}
            >
              Đóng
            </Button>
          </div>
          {/* <hr className="w-full my-2 border-blue-gray-100" /> */}
        </div>

        <div className="flex flex-col gap-1 mt-[70px]">
          <div className="flex flex-col gap-4 bg-white p-4 rounded-md ">
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
          <div className="bg-white p-4 rounded-md ">
            <Typography className="border-b-4 border-[#164e63] font-bold uppercase text-sm pb-1">
              Mô tả công việc
            </Typography>
            <div className="text-sm py-2">
              {(jobDetailData.jobDescription &&
                parse(jobDetailData.jobDescription)) ||
                ""}
            </div>
          </div>
          <div className="bg-white p-4 rounded-md ">
            <Typography className="border-b-4 border-[#164e63] font-bold uppercase text-sm pb-1">
              Yêu cầu ứng viên
            </Typography>
            <div className="text-sm py-2">
              {(jobDetailData.candidateRequirements &&
                parse(jobDetailData.candidateRequirements)) ||
                ""}
            </div>
          </div>
          <div className="bg-white p-4 rounded-md ">
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
      </Drawer>
    </div>
  );
};

export default ListJobsPage;
