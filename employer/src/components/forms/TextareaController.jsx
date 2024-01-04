import React from "react";
import { Controller } from "react-hook-form";
import { Textarea, Typography } from "@material-tailwind/react";

const TextareaController = ({
  name,
  control,
  label,
  error,
  isDisabled = false,
  isField = false,
}) => {
  return (
    <div className="flex flex-col relative ml-8 w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div
            className={`${
              isField ? "flex flex-col gap-1" : "grid grid-cols-4"
            }`}
          >
            <label className="col-span-1 text-base font-bold whitespace-no-wrap text-teal-800">
              {label}
            </label>
            <div
              className={`${
                isField ? "w-[86%]" : "col-span-2 relative w-full"
              } `}
            >
              <Textarea
                label={label}
                {...field}
                error={!!error}
                className="col-span-3 bg-white w-full"
                disabled={isDisabled}
                color="blue"
              />
              {!!error && (
                <Typography
                  color="red"
                  className="absolute -bottom-3 text-xs font-medium"
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

export default TextareaController;
