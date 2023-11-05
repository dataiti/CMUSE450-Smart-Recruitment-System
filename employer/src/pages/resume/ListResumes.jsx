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
                            Chi tiết
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
    </div>
  );
};

export default ListResumes;
