import React, { useEffect, useState } from "react";
import {
  useGenerateTimeBasedLineChartForAdminQuery,
  useGenerateTimeBasedPieChartForAdminQuery,
  useGetOveviewStatisticsQuery,
  useGetTechnicalAndWorkPositionTrendingChartQuery,
} from "../../redux/features/apis/analyticApi";
import { authSelect } from "../../redux/features/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../../utils/icons";
import { setTitle } from "../../redux/features/slices/titleSlice";
import { StatisticIndex, Modal } from "../../components/shares";
import {
  TrendingChartModal,
  LineChartModal,
  PieChart,
  LineChart,
} from "../../components/charts";

const DashboardPage = () => {
  const dispatch = useDispatch();

  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [type, setType] = useState("applicated");
  const [typeTime, setTypeTime] = useState("year");
  const [typeTreding, setTypeTrending] = useState("skills");
  const [typePieChart, setTypePieChart] = useState("industry");
  const [lineChartOpen, setLineChartOpen] = useState(false);
  const [trendingChartOpen, setTrendingChartOpen] = useState(false);

  const { user } = useSelector(authSelect);

  const { data: oveviewStatisticsData } = useGetOveviewStatisticsQuery(
    {
      userId: user?._id,
    },
    { refetchOnMountOrArgChange: true, skip: !user }
  );

  const { data: lineChartData } = useGenerateTimeBasedLineChartForAdminQuery(
    {
      userId: user?._id,
      startDay,
      endDay,
      type,
      typeTime,
    },
    { refetchOnMountOrArgChange: true, skip: !user }
  );

  const { data: technicalTrendingData } =
    useGetTechnicalAndWorkPositionTrendingChartQuery(
      {
        type: typeTreding,
      },
      { refetchOnMountOrArgChange: true }
    );

  const { data: pieChartData } = useGenerateTimeBasedPieChartForAdminQuery(
    {
      userId: user?._id,
      type: typePieChart,
    },
    { refetchOnMountOrArgChange: true, skip: !user }
  );

  useEffect(() => {
    dispatch(setTitle("Dashboard"));
  }, [dispatch]);

  return (
    <div className="m-[10px] flex flex-col gap-2">
      <div className="grid grid-cols-5 gap-2">
        <StatisticIndex
          title="Tổng việc tuyển dụng"
          icon={<icons.IoBriefcase size={20} />}
          index={oveviewStatisticsData?.data?.numberOfTotalJobs}
        />
        <StatisticIndex
          title="Tổng nhà tuyển dụng"
          icon={<icons.IoBriefcase size={20} />}
          index={oveviewStatisticsData?.data?.numberOfTotalEmployers}
        />
        <StatisticIndex
          title="Tổng CV ứng tuyển"
          icon={<icons.IoBriefcase size={20} />}
          index={oveviewStatisticsData?.data?.numberOfTotalApplyJobs}
        />
        <StatisticIndex
          title="Tổng người dùng"
          icon={<icons.IoBriefcase size={20} />}
          index={oveviewStatisticsData?.data?.numberOfTotalUsers}
        />
        <StatisticIndex
          title="Người danh mục"
          icon={<icons.IoBriefcase size={20} />}
          index={oveviewStatisticsData?.data?.numberOfTotalCategories}
        />
      </div>
      <div className="w-full flex gap-2">
        <div
          className="w-[46%] p-2 bg-white shadow-sm rounded-md flex flex-col gap-2 cursor-pointer"
          onClick={() => setLineChartOpen(true)}
        >
          <LineChart data={lineChartData?.data} type={typeTime} />
        </div>
        <div className="w-[54%] grid grid-cols-2 gap-2">
          <div className="p-2 bg-white rounded-md">
            <PieChart data={pieChartData?.data} />
          </div>
          <div className="p-2 bg-white rounded-md">
            <PieChart data={pieChartData?.data} />
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-3  gap-2">
        <div
          className=" p-2 bg-white shadow-sm rounded-md flex flex-col gap-2"
          onClick={() => setTrendingChartOpen(true)}
        >
          <LineChart data={technicalTrendingData?.data} type="month" />
        </div>
        <div className="p-2 bg-white shadow-sm rounded-md flex flex-col gap-2">
          <LineChart data={lineChartData?.data} type={typeTime} />
        </div>
        <div className="p-2 bg-white shadow-sm rounded-md flex flex-col gap-2">
          <LineChart data={technicalTrendingData?.data} type={typeTime} />
        </div>
      </div>
      <Modal open={lineChartOpen} handleOpen={setLineChartOpen} size="lg">
        <LineChartModal
          data={lineChartData?.data}
          setTypeTime={setTypeTime}
          setType={setType}
          setStartDay={setStartDay}
          setEndDay={setEndDay}
          startDay={startDay}
          endDay={endDay}
          type={type}
          typeTime={typeTime}
        />
      </Modal>
      <Modal
        open={trendingChartOpen}
        handleOpen={setTrendingChartOpen}
        size="md"
      >
        <TrendingChartModal
          data={technicalTrendingData?.data}
          type={typeTreding}
          setType={setTypeTrending}
        />
      </Modal>
    </div>
  );
};

export default DashboardPage;
