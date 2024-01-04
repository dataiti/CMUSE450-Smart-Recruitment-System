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
  defaultValue = "",
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
                label={defaultValue || label}
                {...field}
                error={!!error}
                disabled={isDisabled}
                className=" bg-white w-full"
                labelProps={{
                  className: "w-full",
                }}
                color="blue"
                value=""
              >
                {options?.map(({ text, value, id }) => {
                  return (
                    <Option
                      key={id}
                      value={JSON.stringify({ id, value })}
                      className="font-bold text-sm"
                    >
                      {text || value}
                    </Option>
                  );
                })}
              </Select>
              {!!error && (
                <Typography
                  color="red"
                  className="absolute -bottom-5 text-xs font-medium"
                >
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
