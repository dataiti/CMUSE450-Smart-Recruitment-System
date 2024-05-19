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
  isField = false,
  defaultValue = "",
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
              <Input
                type={type}
                label={defaultValue.toString() || label.toString()}
                {...field}
                error={!!error}
                disabled={isDisabel}
                className=" bg-white w-full"
                labelProps={{
                  className: "w-full",
                }}
                color="blue"
                spellCheck={false}
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
