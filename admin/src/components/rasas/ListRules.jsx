import React from "react";
import { Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedRule,
  rulesSelect,
} from "../../redux/features/slices/rulesRasaSlice";
import jsyaml from "js-yaml";

const ListRules = ({ data = [], setYamlValue }) => {
  const dispatch = useDispatch();

  const { listRules, selectedRule } = useSelector(rulesSelect);

  return (
    <div className="h-screen flex flex-col border-r border-blue-gray-200">
      <Typography className="text-lg font-bold text-center py-4 border-b border-blue-gray-200">
        Rules.yml
      </Typography>
      <div className="flex justify-center my-2">
        <button
          className="bg-gray-400 py-2 px-5 rounded-full text-xs font-bold"
          onClick={() => setYamlValue(jsyaml.dump(listRules))}
        >
          Xem tất cả rules
        </button>
      </div>
      <div className="flex flex-col">
        {data?.map((item, index) => {
          const isSelected = selectedRule?.rule === item?.rule;

          return (
            <div
              className={`p-4 text-sm font-bold text-gray-700 border-r-4 cursor-pointer ${
                isSelected ? "bg-blue-gray-100 border-blue-500" : ""
              }`}
              key={index}
              onClick={() => dispatch(setSelectedRule({ data: item }))}
            >
              {item?.rule}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListRules;
