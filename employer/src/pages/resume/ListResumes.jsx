import React, { useEffect, useState } from "react";
import {
  Pagination,
  Loading,
  JobStatusBadge,
  CirculeProgress,
  ButtonCustom,
  SelectCustom,
} from "../../components/shares";
import { useDispatch, useSelector } from "react-redux";
import {
  setListApplyJobs,
  applyJobSelect,
} from "../../redux/features/slices/applyJobSlice";
import { authSelect } from "../../redux/features/slices/authSlice";
import {
  orderByOptions,
  sortByOptions,
  statusApplyJobOptions,
  tableHeadApplyJob,
} from "../../utils/constants";
import { Avatar, Input, Typography } from "@material-tailwind/react";
import { useDebounce } from "../../hooks";
import { Link } from "react-router-dom";
import { setTitle } from "../../redux/features/slices/titleSlice";
import { useGetListApplyJobForEmployerQuery } from "../../redux/features/apis/apply";
import { covertToDate } from "../../utils/fn";

const ListResumes = () => {
  const dispatch = useDispatch();

  const { listApplyJobs, totalPage } = useSelector(applyJobSelect);
  const { user } = useSelector(authSelect);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [status, setStatus] = useState("");

  const debouncedValue = useDebounce(search, 500);

  const { data: listApplyJobsData, isFetching } =
    useGetListApplyJobForEmployerQuery(
      {
        userId: user?._id,
        employerId: user?.ownerEmployerId?._id,
        search: debouncedValue,
        page,
        sortBy,
        orderBy,
        limit,
        status,
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
    <div className="m-[10px]">
      {isFetching && <Loading />}
      <div className="flex flex-col gap-2 bg-white p-2 rounded-md">
        <div className="flex items-center gap-3">
          <Input
            label="Tìm kiếm vị trí tuyển dụng"
            value={search}
            onChange={handleChangeSearch}
          />
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
          <div>
            <SelectCustom
              label="Trạng thái"
              options={statusApplyJobOptions}
              value={status}
              onChange={(e) => setStatus(e)}
            />
          </div>
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
                      <td className="px-3 text-xs font-bold py-1 text-blue-gray-800">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={job?.candidateId?.avatar}
                            alt="avatar"
                            className="h-12 w-12 p-1 bg-blue-gray-100"
                          />
                          <div className="flex flex-col">
                            <Typography className="text-xs font-bold">
                              {job?.candidateId?.firstName}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-blue-gray-800">
                        {job?.jobId?.recruitmentTitle}
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-center text-blue-gray-800">
                        <Link
                          to={job?.CVpdf}
                          target="_blank"
                          className="text-blue-500 text-xs hover:underline"
                        >
                          {job?.CVName}
                        </Link>
                      </td>
                      <td className="py-1 text-center text-blue-gray-800">
                        <JobStatusBadge status={job?.status} />
                      </td>
                      <td className="py-1 text-xs text-center text-blue-gray-800">
                        {covertToDate(job?.createdAt)}
                      </td>
                      <td className="py-1 flex justify-center text-center text-blue-gray-800">
                        <CirculeProgress
                          percentage={job?.percentage}
                          className="h-[52px] w-[52px]"
                        />
                      </td>
                      <td className="px-1 text-xs font-bold py-1 text-blue-gray-800">
                        <Link to={`/cv-processing/${job?._id}`}>
                          <ButtonCustom className="text-xs capitalize font-bold rounded-md min-w-[90px] bg-blue-50 text-blue-500">
                            Chi tiết
                          </ButtonCustom>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <Pagination
          totalPage={totalPage}
          handlePageChange={handlePageChange}
          page={page}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
};

export default ListResumes;
