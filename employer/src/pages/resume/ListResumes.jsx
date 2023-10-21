import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  setListApplyJobs,
  applyJobSelect,
} from "../../redux/features/slices/applyJobSlice";
import { authSelect } from "../../redux/features/slices/authSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { tableHeadApplyJob } from "../../utils/constants";
import { covertToDate } from "../../utils/fn";
import { Avatar, Button, Input, Typography } from "@material-tailwind/react";
import { useDebounce } from "../../hooks";
import { Link } from "react-router-dom";
import { setTitle } from "../../redux/features/slices/titleSlice";
import Loading from "../../components/Loading";
import { useGetListApplyJobForEmployerQuery } from "../../redux/features/apis/apply";

const ListResumes = () => {
  const dispatch = useDispatch();

  const { listApplyJobs, totalPage } = useSelector(applyJobSelect);
  const { user } = useSelector(authSelect);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);

  const debouncedValue = useDebounce(search, 500);

  const { data: listApplyJobsData, isFetching } =
    useGetListApplyJobForEmployerQuery(
      {
        userId: user?._id,
        employerId: user?.ownerEmployerId?._id
          ? user?.ownerEmployerId?._id
          : skipToken,
        search: debouncedValue,
        page,
        limit,
        status: "",
      },
      { refetchOnMountOrArgChange: true }
    );

  useEffect(() => {
    console.log(listApplyJobsData);
    if (listApplyJobsData && listApplyJobsData.success) {
      dispatch(
        setListApplyJobs({
          data: listApplyJobsData.data,
          totalPage: listApplyJobsData.totalPage,
          currentPage: listApplyJobsData.currentPage,
          count: listApplyJobsData.count,
        })
      );
    }
  }, [dispatch, listApplyJobsData]);

  useEffect(() => {
    dispatch(setTitle("Quản lý CV & hồ sơ ứng tuyển"));
  }, [dispatch]);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  return (
    <div className="mx-[30px] my-[30px]">
      {isFetching && <Loading />}
      <div className="flex flex-col gap-2 bg-white p-2 rounded-md">
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
          <table className="w-full text-sm font-bold text-left cursor-pointer border border-blue-gray-100 !rounded-md">
            <thead className="text-xs  text-[#212f3f] bg-blue-gray-100 uppercase border-b border-blue-gray-100">
              <tr>
                {tableHeadApplyJob.map(({ id, name }) => {
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
              {listApplyJobs?.length > 0 &&
                listApplyJobs.map((job, index) => {
                  return (
                    <tr
                      className="bg-white border-b border-blue-gray-100 hover:bg-gray-100 "
                      key={job?._id || index}
                    >
                      <td className="px-2 text-sm font-bold py-3 text-blue-gray-800 whitespace-nowrap">
                        ... {job?._id.slice(-4)}
                      </td>
                      <td className="px-3 text-sm font-bold py-3 text-blue-gray-800">
                        <div className="flex items-center">
                          <Avatar src={job?.candidateId?.avatar} alt="avatar" />
                          <div className="flex flex-col">
                            <Typography className="text-xs font-bold">
                              {job?.candidateId?.lastName +
                                " " +
                                job?.candidateId?.firstName}
                            </Typography>
                            <Typography className="text-xs font-bold">
                              {job?.candidateId?.email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 text-sm font-bold py-3 text-blue-gray-800">
                        {job?.jobId?.recruitmentCampaignName}
                      </td>
                      <td className="px-2 text-sm font-bold py-3 text-center text-blue-gray-800">
                        <Link
                          to={job?.CVpdf}
                          target="_blank"
                          className="text-blue-500 text-xs hover:underline"
                        >
                          {job?.CVName}
                        </Link>
                      </td>
                      <td className="py-3 text-center text-blue-gray-800">
                        {job.status === "notviewed" ? (
                          <div className="p-2 rounded-md text-[10px] bg-blue-50 text-blue-500">
                            Chưa xem
                          </div>
                        ) : job.status === "viewed" ? (
                          <div className="p-2 rounded-md text-[10px] bg-green-50 text-green-500">
                            Đã xem
                          </div>
                        ) : job.status === "accepted" ? (
                          <div className="p-2 rounded-md text-[10px] bg-yellow-50 text-yellow-500">
                            Được chấp nhận
                          </div>
                        ) : job.status === "rejected" ? (
                          <div className="p-2 rounded-md text-[10px] bg-red-50 text-red-500">
                            Bị từ chối
                          </div>
                        ) : (
                          <div className="p-2 rounded-md text-[10px] bg-indigo-50 text-indigo-500">
                            Đang tiến triển
                          </div>
                        )}
                      </td>
                      <td className="px-2 text-sm font-bold py-3 text-center text-blue-gray-800">
                        {covertToDate(job?.createdAt)}
                      </td>
                      <td className="px-1 text-sm font-bold py-3 text-blue-gray-800">
                        <Link to={`/list-resumes/${job?._id}`}>
                          <Button
                            variant="filled"
                            className="text-xs capitalize font-bold rounded-full !p-3  bg-blue-gray-900 text-light-blue-600"
                          >
                            Xem Chi tiết
                          </Button>
                        </Link>
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
      {/* <Drawer
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
                  <Typography className="text-sm font-bold">
                    Mức lương
                  </Typography>
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
            <Typography className="border-b-4 border-[#164e63] uppercase text-sm font-bold pb-1">
              Mô tả công việc
            </Typography>
            <div className="text-sm font-bold py-2">
              {(jobDetailData.jobDescription &&
                parse(jobDetailData.jobDescription)) ||
                ""}
            </div>
          </div>
          <div className="bg-white p-4 rounded-md ">
            <Typography className="border-b-4 border-[#164e63] uppercase text-sm font-bold pb-1">
              Yêu cầu ứng viên
            </Typography>
            <div className="text-sm font-bold py-2">
              {(jobDetailData.candidateRequirements &&
                parse(jobDetailData.candidateRequirements)) ||
                ""}
            </div>
          </div>
          <div className="bg-white p-4 rounded-md ">
            <Typography className="border-b-4 border-[#164e63] uppercase text-sm font-bold pb-1">
              Phúc lợi ứng viên
            </Typography>
            <div className="text-sm font-bold py-2">
              {(jobDetailData.candidateBenefits &&
                parse(jobDetailData.candidateBenefits)) ||
                ""}
            </div>
          </div>
        </div>
      </Drawer> */}
    </div>
  );
};

export default ListResumes;
