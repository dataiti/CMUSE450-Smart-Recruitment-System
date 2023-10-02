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
    <div className="flex flex-col relative ml-10">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-4">
            <label className="col-span-1 text-sm font-bold whitespace-no-wrap">
              {label}
            </label>
            <div className="w-[500px]">
              <Input
                type={type}
                label={label}
                {...field}
                error={!!error}
                className="col-span-3 bg-white"
                disabled={isDisabel}
              />
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

export default InputController;
