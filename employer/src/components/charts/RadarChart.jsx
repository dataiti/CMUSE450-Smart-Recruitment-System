import React from "react";
import { Radar } from "react-chartjs-2";
import Chart from "chart.js/auto";

import "chart.js/auto";

const RadarChart = ({
  data = [
    { title: 1, value: 0 },
    { title: 2, value: 0 },
    { title: 3, value: 0 },
    { title: 4, value: 0 },
    { title: 5, value: 0 },
  ],
  type = "",
}) => {
  const chartData = {
    labels: data?.map((item) => `${item?.title}`),
    datasets: [
      {
        label: `Biểu đồ Radar biểu hiện số lượng ${type}`,
        data: data.map((item) => item?.value || 0),
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        borderColor: "#fff",
        pointBackgroundColor: "#fff",
      },
    ],
  };

  return (
    <>
      <Radar
        className=""
        data={chartData}
        options={{
          responsive: true,
          scales: {
            r: {
              grid: {
                display: true,
                color: ["#e74c3c", "#f39c12", "#2ecc71", "#3498db", "#9b59b6"],
              },
              suggestedMin: 0,
              suggestedMax: 100,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
        type={Chart.defaults.radar ? Chart.defaults.radar.type : ""}
      />
    </>
  );
};

export default RadarChart;
