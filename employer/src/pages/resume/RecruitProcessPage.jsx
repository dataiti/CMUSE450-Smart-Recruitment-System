import React from "react";
import { ToolbarCV } from "../../components/shares";
import ResumeDetail from "./ResumeDetail";

const RecruitProcessPage = () => {
  return (
    <div className="flex">
      <div className="w-full">
        <ResumeDetail />
      </div>
      <ToolbarCV />
    </div>
  );
};

export default RecruitProcessPage;
