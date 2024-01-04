import React from "react";
import { Controller } from "react-hook-form";
import { Textarea, Typography } from "@material-tailwind/react";

const TextareaController = ({
  name,
  control,
  label,
  error,
  isDisabled = false,
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
              <Textarea
                label={label}
                {...field}
                error={!!error}
                disabled={isDisabled}
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

export default TextareaController;
