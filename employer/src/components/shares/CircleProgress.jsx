import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useSelector } from "react-redux";
import "react-circular-progressbar/dist/styles.css";

import { authSelect } from "../../redux/features/slices/authSlice";

const CircleProgress = ({ percentage = 25, className = "" }) => {
  const { user } = useSelector(authSelect);

  return (
    <div className={`rounded-full bg-white ${className}`}>
      {user && (
        <CircularProgressbar
          className="h-[55px] w-[55px] "
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            rotation: 0.25,
            pathTransitionDuration: 0.5,
            pathColor: `rgba(0, 255, 0, ${percentage / 100})`,
            textColor: "#f88",
            trailColor: "#d6d6d6",
            backgroundColor: "#3e98c7",
          })}
          strokeWidth={14}
        />
      )}
    </div>
  );
};

export default CircleProgress;
