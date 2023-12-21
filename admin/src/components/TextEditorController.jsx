import { Typography } from "@material-tailwind/react";
import React from "react";
import { Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditorController = ({
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
              <ReactQuill
                {...field}
                value={field.value || ""}
                theme="snow"
                modules={{}}
                className={`w-full h-[250px] ${
                  !!error ? "border-red-500" : ""
                }`}
                readOnly={isDisabled}
                style={{ borderRadius: "10px" }}
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

export default TextEditorController;
