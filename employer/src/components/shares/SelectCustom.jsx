import { Option, Select } from "@material-tailwind/react";
import React from "react";

const SelectCustom = ({ label = "", options = [], onChange, value }) => {
  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      className=" bg-white w-full col-span-1 text-sm font-bold"
      labelProps={{
        className: "w-full text-sm font-bold",
      }}
    >
      {options?.map(({ value, text, id }) => {
        return (
          <Option key={id} value={value} className="text-sm font-bold">
            {text || value}
          </Option>
        );
      })}
    </Select>
  );
};

export default SelectCustom;
