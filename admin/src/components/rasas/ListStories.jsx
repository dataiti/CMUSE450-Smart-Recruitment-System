import React from "react";
import { Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedStory,
  storiesSelect,
} from "../../redux/features/slices/storiesRasaSlice";
import jsyaml from "js-yaml";

const ListStories = ({ data = [], setYamlValue }) => {
  const dispatch = useDispatch();

  const { listStories, selectedStory } = useSelector(storiesSelect);

  return (
    <div className="h-screen flex flex-col border-r border-blue-gray-200">
      <Typography className="text-lg font-bold text-center py-4 border-b border-blue-gray-200">
        Stories.yml
      </Typography>
      <div className="flex justify-center my-2">
        <button
          className="bg-gray-400 py-2 px-5 rounded-full text-xs font-bold"
          onClick={() => setYamlValue(jsyaml.dump(listStories))}
        >
          Xem tất cả stories
        </button>
      </div>
      <div className="flex flex-col">
        {data?.map((item, index) => {
          const isSelected = selectedStory?.story === item?.story;

          return (
            <div
              className={`p-4 text-sm font-bold text-gray-700 border-r-4 cursor-pointer ${
                isSelected ? "bg-blue-gray-100 border-blue-500" : ""
              }`}
              key={index}
              onClick={() => dispatch(setSelectedStory({ data: item }))}
            >
              {item?.story}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListStories;
