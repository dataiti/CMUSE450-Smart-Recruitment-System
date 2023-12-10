import React from "react";
import { Controller } from "react-hook-form";
import { Radio, Typography } from "@material-tailwind/react";

const RadioController = ({
  name,
  control,
  label,
  error,
  values = [],
  isDisabled = false,
  defaultChecked = false,
}) => {
  return (
    <div className="flex flex-col relative ml-10">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-4">
            <label className="col-span-1 text-sm font-bold whitespace-no-wrap">
              {label}
            </label>
            <div className="col-span-3 flex items-center">
              {values.map((value, index) => {
                return (
                  <Radio
                    key={index}
                    {...field}
                    label={value.label}
                    error={!!error}
                    value={value.value}
                    className="bg-white"
                    labelProps={{
                      className: "pl-2",
                    }}
                    disabled={isDisabled}
                    defaultChecked={defaultChecked}
                  />
                );
              })}
            </div>
          </div>
        )}
      />
      {!!error && (
        <Typography color="red" className="absolute -bottom-6 text-sm">
          {error?.message}
        </Typography>
      )}
    </div>
  );
};

export default RadioController;
