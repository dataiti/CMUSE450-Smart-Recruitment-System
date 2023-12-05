import React from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

const ShareButton = ({ jobDetailData, isRow }) => {
  return (
    <div
      className={`flex ${
        isRow ? "" : "flex-col"
      } gap-2 bg-white p-2 rounded-full `}
    >
      <FacebookShareButton
        url={"https://github.com/dataiti" || ""}
        quote={`Check out this job: ${jobDetailData?.data?.recruitmentTitle}`}
      >
        <FacebookIcon size={36} round />
      </FacebookShareButton>
      <LinkedinShareButton
        url={"https://github.com/dataiti" || ""}
        title={`Check out this job: ${jobDetailData?.data?.recruitmentTitle}`}
      >
        <LinkedinIcon size={36} round />
      </LinkedinShareButton>
      <TwitterShareButton
        url={"https://github.com/dataiti" || ""}
        title={`Check out this job: ${jobDetailData?.data?.recruitmentTitle}`}
      >
        <TwitterIcon size={36} round />
      </TwitterShareButton>
    </div>
  );
};

export default ShareButton;
