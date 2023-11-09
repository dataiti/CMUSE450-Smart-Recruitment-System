import React from "react";
import { Bar } from "react-chartjs-2";

const LineChart = ({
  data = [
    {
      _id: "ReactJS",
      value: 4,
    },
    {
      _id: "Java",
      value: 3,
    },
    {
      _id: "Kotlin",
      value: 3,
    },
    {
      _id: "NodeJS",
      value: 3,
    },
    {
      _id: "Javascript",
      value: 2,
    },
  ],
  className = "",
  type = "week",
}) => {
  const chartData = {
    labels: data.map((item) => item?._id),
    datasets: [
      {
        data: data.map((item) => item?.value || 0),
        backgroundColor: [
          "#e74c3c",
          "#f39c12",
          "#2ecc71",
          "#3498db",
          "#9b59b6",
        ],
        barPercentage: 0.7,
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
                color: "white",
              },
            },
            y: {
              grid: {
                display: true,
              },
              ticks: {
                color: "white",
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
