import React, { useEffect, useState } from "react";
import {
  useGenerateTimeBasedLineChartQuery,
  useGenerateTimeBasedPieChartByIndustryQuery,
  useGetOveviewStatisticsQuery,
} from "../../redux/features/apis/analyticApi";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { authSelect } from "../../redux/features/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import { Avatar, Button, Input, Typography } from "@material-tailwind/react";
import {
  tableHeadApplyJobDashboard,
  typeChartPercentOptions,
  typeChartRowOptions,
  typeTimeChartOptions,
} from "../../utils/constants";
import SelectCustom from "../../components/SelectCustom";
import { icons } from "../../utils/icons";
import MyCalendar from "../../components/MyCalendar";
import { setTitle } from "../../redux/features/slices/titleSlice";
import { Link } from "react-router-dom";
import {
  applyJobSelect,
  setListApplyJobs,
} from "../../redux/features/slices/applyJobSlice";
import { useGetListApplyJobForEmployerQuery } from "../../redux/features/apis/apply";
import Pagination from "../../components/Pagination";
import StatisticIndex from "../../components/StatisticIndex";
import Loading from "../../components/Loading";

const DashboardPage = () => {
  const dispatch = useDispatch();

  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [type, setType] = useState("applicated");
  const [typeTime, setTypeTime] = useState("month");
  const [typePieChart, setTypePieChart] = useState("industry");

  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const { user } = useSelector(authSelect);
  const { listApplyJobs, totalPage } = useSelector(applyJobSelect);

  const {
    data: oveviewStatisticsData,
    isFetching: isFetchingOveviewStatistics,
  } = useGetOveviewStatisticsQuery(
    {
      userId: user?._id ? user?._id : skipToken,
      employerId: user?.ownerEmployerId?._id
        ? user?.ownerEmployerId?._id
        : skipToken,
    },
    { refetchOnMountOrArgChange: true }
  );

  const { data: lineChartData, isFetching: isFetchingLineChart } =
    useGenerateTimeBasedLineChartQuery(
      {
        userId: user?._id ? user?._id : skipToken,
        employerId: user?.ownerEmployerId?._id
          ? user?.ownerEmployerId?._id
          : skipToken,
        startDay,
        endDay,
        type,
        typeTime,
      },
      { refetchOnMountOrArgChange: true }
    );

  const { data: pieChartData, isFetching: isFetchingPieChart } =
    useGenerateTimeBasedPieChartByIndustryQuery(
      {
        userId: user?._id ? user?._id : skipToken,
        employerId: user?.ownerEmployerId?._id
          ? user?.ownerEmployerId?._id
          : skipToken,
        type: typePieChart,
      },
      { refetchOnMountOrArgChange: true }
    );

  const { data: listApplyJobsData, isFetching: isFetchingListApplyJobs } =
    useGetListApplyJobForEmployerQuery(
      {
        userId: user?._id,
        employerId: user?.ownerEmployerId?._id
          ? user?.ownerEmployerId?._id
          : skipToken,
        search: "",
        page,
        limit,
        status: "notviewed",
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
    dispatch(setTitle("Dashboard"));
  }, [dispatch]);

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleSelectedTypeTimeChart = (e) => {
    setTypeTime(e);
  };

  const handleSelectedTypeChart = (e) => {
    setType(e);
  };

  const handleSelectedTypePieChart = (e) => {
    setTypePieChart(e);
  };

  const handleChangeStartDay = (e) => {
    setStartDay(e.target.value);
  };

  const handleChangeEndDay = (e) => {
    setEndDay(e.target.value);
  };

  console.log(oveviewStatisticsData);

  return (
    <div className="my-3 mx-5 flex flex-col gap-2">
      {(isFetchingOveviewStatistics ||
        isFetchingLineChart ||
        isFetchingPieChart ||
        isFetchingListApplyJobs) && <Loading />}
      <div className="grid grid-cols-5 gap-2">
        <StatisticIndex
          title="Tổng tin tuyển dụng"
          icon={<icons.IoBriefcase size={20} />}
          index={oveviewStatisticsData?.data?.numberOfTotalJobs}
        />
        <StatisticIndex
          title="Tin đang mở"
          icon={<icons.IoBriefcase size={20} />}
          index={oveviewStatisticsData?.data?.numberOfOpenJobs}
        />
        <StatisticIndex
          title="Tổng CV ứng tuyển"
          icon={<icons.HiDocumentText size={20} />}
          index={oveviewStatisticsData?.data?.numberOfTotalApplyJobs}
        />
        <StatisticIndex
          title="CV chưa xem"
          icon={<icons.HiDocumentText size={20} />}
          index={oveviewStatisticsData?.data?.numberOfApplyJobsNotViewed}
        />
        <StatisticIndex
          title="Người theo dõi"
          icon={<icons.FaUserCheck size={20} />}
          index={oveviewStatisticsData?.data?.numberOfFollower}
        />
      </div>
      <div className="p-2 bg-white shadow-sm rounded-md flex items-center gap-2">
        <Input
          type="date"
          label="Từ ngày"
          value={startDay}
          onChange={handleChangeStartDay}
        />
        <Input
          type="date"
          label="Đến ngày"
          value={endDay}
          onChange={handleChangeEndDay}
        />
        <SelectCustom
          options={typeTimeChartOptions}
          label="Chọn loại thời gian"
          value={typeTime}
          onChange={handleSelectedTypeTimeChart}
        />
        <SelectCustom
          options={typeChartRowOptions}
          label="Thống kê cột theo"
          value={type}
          onChange={handleSelectedTypeChart}
        />
        <SelectCustom
          options={typeChartPercentOptions}
          label="Thống kê phần trăm theo"
          value={typePieChart}
          onChange={handleSelectedTypePieChart}
        />
      </div>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-8 p-2 bg-white shadow-sm rounded-md flex flex-col gap-2">
          <LineChart data={lineChartData?.data} type={typeTime} />
        </div>
        <div className="col-span-4 p-2 bg-white shadow-sm rounded-md">
          <PieChart data={pieChartData?.data} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white shadow-sm p-2 rounded-md">
          <div className="flex items-center justify-between">
            <Typography className="font-bold uppercase text-xs py-1 text-teal-800">
              Lịch trình
            </Typography>
            <Link
              to="/list-resumes"
              className="hover:underline text-blue-500 text-xs font-bold"
            >
              Xem thêm
            </Link>
          </div>
          <MyCalendar />
        </div>
        <div className="col-span-2 bg-white shadow-sm p-2 rounded-md">
          <div className="flex items-center justify-between">
            <Typography className="font-bold uppercase text-xs py-1 text-teal-800">
              Danh sách CV chưa xem
            </Typography>
            <Link
              to="/list-resumes"
              className="hover:underline text-blue-500 text-xs font-bold"
            >
              Xem thêm
            </Link>
          </div>
          <div className="">
            <div className="">
              <table className="w-full text-sm font-bold text-left cursor-pointer border border-blue-gray-100 !rounded-md">
                <thead className="text-xs  text-[#212f3f] bg-blue-gray-100 uppercase border-b border-blue-gray-100">
                  <tr>
                    {tableHeadApplyJobDashboard.map(({ id, name }) => {
                      return (
                        <th
                          key={id}
                          scope="col"
                          className="px-6 py-3 text-xs text-center whitespace-nowrap"
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
                          <td className="px-2 text-sm font-bold py-1 text-blue-gray-800 whitespace-nowrap">
                            ... {job?._id.slice(-4)}
                          </td>
                          <td className="px-3 text-sm font-bold py-1 text-blue-gray-800">
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={job?.candidateId?.avatar}
                                alt="avatar"
                                className="!h-10 !w-10 border border-r-gray-200"
                              />
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
                          <td className="px-2 text-xs font-bold py-1 text-blue-gray-800">
                            {job?.jobId?.recruitmentCampaignName}
                          </td>

                          <td className="py-1 text-center text-blue-gray-800">
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
                          <td className="px-1 text-xs font-bold py-1 text-blue-gray-800">
                            <Link to={`/list-resumes/${job?._id}`}>
                              <Button
                                variant="filled"
                                className="!text-xs capitalize font-bold rounded-full !p-3  bg-blue-gray-900 text-light-blue-600"
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
    </div>
  );
};

export default DashboardPage;
