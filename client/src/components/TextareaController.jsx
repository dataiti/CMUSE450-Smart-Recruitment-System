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
              <Textarea
                label={label}
                {...field}
                error={!!error}
                className="col-span-3 bg-white w-full"
                disabled={isDisabled}
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

export default TextareaController;
