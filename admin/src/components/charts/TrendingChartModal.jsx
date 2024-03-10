import React from "react";
import { LineChart } from "../charts";
import { SelectCustom } from "../shares";

const TrendingChartModal = ({ type, setType, data }) => {
  const handleSelectedTypeTimeChart = (e) => {
    setType(e);
  };

  return (
    <div className="bg-white p-2 rounded-md flex flex-col">
      <SelectCustom
        options={[
          { id: 1, text: "Xu hương công nghệ", value: "skills" },
          {
            id: 1,
            text: "Xu hương theo vị trí công việc",
            value: "workPosition",
          },
        ]}
        label="Chọn loại thời gian"
        value={type}
        onChange={handleSelectedTypeTimeChart}
      />
      <div className="w-full ">
        <LineChart data={data} type="month" />
      </div>
    </div>
  );
};

export default TrendingChartModal;
