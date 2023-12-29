import { Typography } from "@material-tailwind/react";
import React from "react";
import { Tag } from "../shares";
import { icons } from "../../utils/icons";

const SkillTags = ({ data = [], title = "", className }) => {
  return (
    <div className="flex flex-col gap-2">
      <Typography className="text-sm font-bold text-light-blue-600">
        {title}
      </Typography>
      <div className="flex items-center gap-2 flex-wrap">
        {data?.map((skill, index) => (
          <Tag
            key={index}
            className={`rounded-md !px-6 !py-2 !text-base ${className}`}
            icon={<icons.BsFillCheckCircleFill />}
          >
            {skill}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default SkillTags;
