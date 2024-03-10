import React from "react";
import { Controller } from "react-hook-form";
import { Select, Option, Typography } from "@material-tailwind/react";

const SelectController = ({
  name,
  control,
  label,
  error,
  isDisabled = false,
  options = [],
}) => {
  return (
    <div className="flex flex-col relative ml-10 w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-4">
            <label className="col-span-1 text-base font-bold whitespace-no-wrap text-teal-800">
              {label}
            </label>
            <div className="col-span-2 w-full">
              <Select
                label={label}
                {...field}
                error={!!error}
                disabled={isDisabled}
                value=""
                className=" bg-white w-full"
                labelProps={{
                  className: "w-full",
                }}
              >
                {options?.map(({ value, id }) => {
                  return (
                    <Option key={id} value={JSON.stringify({ id, value })}>
                      {value}
                    </Option>
                  );
                })}
              </Select>

              {!!error && (
                <Typography color="red" className="absolute -bottom-5 text-xs">
                  {error?.message}
                </Typography>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default SelectController;
