import { Option, Select } from "@material-tailwind/react";
import React from "react";

const SelectCustom = ({ label = "", options = [], onChange, value }) => {
  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      className=" bg-white w-full col-span-1"
      labelProps={{
        className: "w-full",
      }}
    >
      {options?.map(({ value, text, id }) => {
        return (
          <Option key={id} value={value}>
            {text || value}
          </Option>
        );
      })}
    </Select>
  );
};

export default SelectCustom;
