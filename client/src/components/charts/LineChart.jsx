import React from "react";
import { Bar } from "react-chartjs-2";

const LineChart = ({ data = [], className = "", type = "week" }) => {
  const chartData = {
    labels: data?.map((item) => item?._id),
    datasets: [
      {
        data: data?.map((item) => item?.value || 0),
        backgroundColor: [
          "#0f172a",
          "#1e293b",
          "#334155",
          "#475569",
          "#64748b",
          "#94a3b8",
          "#cbd5e1",
        ],
        barPercentage: 0.5,
      },
    ],
  };

  return (
    <>
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
              ticks: {
                color: "black",
                fontSize: 6,
              },
            },
            y: {
              grid: {
                display: true,
              },
              ticks: {
                color: "black",
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
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </>
  );
};

export default LineChart;
