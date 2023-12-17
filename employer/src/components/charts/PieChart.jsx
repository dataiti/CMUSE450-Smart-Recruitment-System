import React from "react";
import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

const PieChart = ({ data = [], type = "" }) => {
  const chartData = {
    labels: data.map((item) => item?._id || ""),
    datasets: [
      {
        label: `Biểu đồ tròn biểu hiện số lượng ${type}`,
        data: data.map((item) => item?.value || 0),
        backgroundColor: [
          "#0f172a",
          "#334155",
          "#64748b",
          "#94a3b8",
          "#e2e8f0",
          "#082f49",
          "#94a3b8",
        ],
      },
    ],
  };

  return (
    <Doughnut
      className="p-10"
      data={chartData}
      options={{
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
        },
      }}
      type={Chart.defaults.doughnut ? Chart.defaults.doughnut.type : ""}
    />
  );
};

export default PieChart;
