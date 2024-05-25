import { Input, Typography } from "@material-tailwind/react";
import React from "react";
import { Controller } from "react-hook-form";

const InputController = ({
  name,
  control,
  label,
  error,
  isDisabel = false,
  type = "text",
}) => {
  return (
    <div className="flex flex-col relative ml-10 w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="w-full grid grid-cols-4">
            <label className="col-span-1 text-base font-bold whitespace-no-wrap text-teal-800">
              {label}
            </label>
            <div className={`col-span-2 relative w-full`}>
              <Input
                type={type}
                label={label}
                {...field}
                error={!!error}
                disabled={isDisabel}
                className=" bg-white w-full"
                labelProps={{
                  className: "w-full",
                }}
                color="blue"
              />
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

export default InputController;
