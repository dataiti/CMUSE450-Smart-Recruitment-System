import React from "react";
import { Bar } from "react-chartjs-2";

const LineChart = ({
  data = [],
  previousYearData = [],
  className = "",
  type = "week",
}) => {
  const barPercentage =
    type === "week"
      ? 0.2
      : type === "month"
      ? 0.7
      : type === "year"
      ? 0.5
      : 0.1;

  const chartData = {
    labels: data.map((item) => item?._id?.slice(0, 2) || ""),
    datasets: [
      {
        label: "Năm trước",
        data: previousYearData.map((item) => item?.value || 0),
        backgroundColor: ["#0f172a"],
        barPercentage: barPercentage,
      },
      {
        label: "Năm nay",
        data: data.map((item) => item?.value || 0),
        backgroundColor: ["#115e59"],
        barPercentage: barPercentage,
      },
    ],
  };

  return (
    <div className={`h-full w-full`}>
      <Bar
        data={chartData}
        options={{
          indexAxis: "x",
          responsive: true,
          scales: {
            x: {
              grid: {
                display: true,
              },
            },
            y: {
              grid: {
                display: true,
              },
            },
          },
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 0,
              bottom: 0,
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart;
