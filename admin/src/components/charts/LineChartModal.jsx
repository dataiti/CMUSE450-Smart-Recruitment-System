import { Input } from "@material-tailwind/react";
import React from "react";
import { SelectCustom } from "../shares";
import {
  typeChartRowOptions,
  typeTimeChartOptions,
} from "../../utils/constants";
import { LineChart } from "../charts";

const LineChartModal = ({
  setTypeTime,
  setType,
  setStartDay,
  setEndDay,
  startDay,
  endDay,
  type,
  typeTime,
  data,
}) => {
  const handleSelectedTypeTimeChart = (e) => {
    setTypeTime(e);
  };

  const handleSelectedTypeChart = (e) => {
    setType(e);
  };

  const handleChangeStartDay = (e) => {
    setStartDay(e.target.value);
  };

  const handleChangeEndDay = (e) => {
    setEndDay(e.target.value);
  };

  return (
    <div className="bg-white p-2 rounded-md w-full flex flex-col">
      <div>
        <div className="p-2 bg-white shadow-sm rounded-md flex items-center gap-2 w-full">
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
        </div>
      </div>
      <div className="w-[100%]">
        <div className="w-[100%] h-full">
          <LineChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default LineChartModal;
