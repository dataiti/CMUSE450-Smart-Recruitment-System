import { Option, Select } from "@material-tailwind/react";
import React from "react";

const SelectCustom = ({ label = "", options = [], onChange, value }) => {
  return (
    <Select
      label={label}
      value=""
      onChange={onChange}
      className="bg-white w-full col-span-1 text-xs font-bold"
      labelProps={{
        className: "w-full !text-xs font-bold",
      }}
      color="blue"
    >
      {options?.map(({ value, text, id }) => {
        return (
          <Option
            key={id}
            value={value.toString()}
            className="text-xs font-bold"
          >
            {text || value}
          </Option>
        );
      })}
    </Select>
  );
};

export default SelectCustom;
