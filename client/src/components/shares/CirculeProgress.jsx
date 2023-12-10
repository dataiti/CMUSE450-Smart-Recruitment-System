import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import React from "react";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";

const CirculeProgress = ({ percentage = 25 }) => {
  const { user } = useSelector(authSelect);

  return (
    <div className="rounded-full bg-white">
      {user && (
        <CircularProgressbar
          className="h-[60px] w-[60px] "
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

export default CirculeProgress;
