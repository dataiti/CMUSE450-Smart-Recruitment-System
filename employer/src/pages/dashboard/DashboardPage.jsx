import React, { useEffect, useState } from "react";
import {
  useGenerateTimeBasedLineChartQuery,
  useGenerateTimeBasedPieChartByIndustryQuery,
} from "../../redux/features/apis/analyticApi";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { authSelect } from "../../redux/features/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import { Input, Typography } from "@material-tailwind/react";
import {
  thongsodata,
  typeChartPercentOptions,
  typeChartRowOptions,
  typeTimeChartOptions,
} from "../../utils/constants";
import SelectCustom from "../../components/SelectCustom";
import { icons } from "../../utils/icons";
import MyCalendar from "../../components/MyCalendar";
import { setTitle } from "../../redux/features/slices/titleSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();

  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [type, setType] = useState("job");
  const [typeTime, setTypeTime] = useState("month");
  const [typePieChart, setTypePieChart] = useState("industry");

  const { user } = useSelector(authSelect);

  const { data: lineChartData } = useGenerateTimeBasedLineChartQuery(
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

  const { data: pieChartData } = useGenerateTimeBasedPieChartByIndustryQuery(
    {
      userId: user?._id ? user?._id : skipToken,
      employerId: user?.ownerEmployerId?._id
        ? user?.ownerEmployerId?._id
        : skipToken,
      type: typePieChart,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    dispatch(setTitle("Dashboard"));
  }, [dispatch]);

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

  return (
    <div className="my-3 mx-5 flex flex-col gap-2">
      <div className="grid grid-cols-5 gap-2">
        {thongsodata.map((item) => {
          return (
            <div
              className="bg-white shadow-sm p-2 rounded-md h-24 flex flex-col items-center"
              key={item.id}
            >
              <Typography className="uppercase text-sm flex items-center gap-2 font-extrabold text-blue-gray-900">
                <div className="p-2 bg-green-50 text-green-900 rounded-full">
                  <icons.IoBriefcase size={20} />
                </div>
                {item.name}
              </Typography>
              <Typography className="text-3xl font-extrabold text-green-900 ">
                {item.value}
              </Typography>
            </div>
          );
        })}
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
        <div className="bg-white shadow-sm p-5 rounded-md">
          <MyCalendar />
        </div>
        <div className="col-span-2 bg-white shadow-sm p-2 rounded-md"></div>
      </div>
    </div>
  );
};

export default DashboardPage;
