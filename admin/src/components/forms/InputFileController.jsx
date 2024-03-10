import { Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { icons } from "../../utils/icons";

const InputController = ({ name, control, label, error, imgUrlPreview }) => {
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (imgUrlPreview) {
      setImagePreview(imgUrlPreview);
    }
  }, [imgUrlPreview]);

  return (
    <div className="flex flex-col relative ml-10 w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-4">
            <label
              htmlFor={name}
              className="col-span-1 text-base font-bold whitespace-no-wrap text-teal-800"
            >
              {label}
            </label>
            <div
              className={`relative cursor-pointer hover:bg-gray-300 transition-all flex items-center justify-center bg-gray-200 w-20 h-20 rounded-full border border-gray-300`}
            >
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt=""
                  className="h-full w-full object-cover rounded-full"
                />
              )}
              <label
                htmlFor={name}
                className=" absolute left-[50%] -translate-x-[50%] "
              >
                <icons.BsCameraFill
                  size={30}
                  className="text-gray-600 cursor-pointer opacity-0 hover:opacity-80 transition-all "
                />
              </label>
              <input
                type="file"
                id={name}
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  field.onChange(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
              />
              {!!error && (
                <Typography
                  color="red"
                  className="absolute -bottom-6 text-sm font-medium"
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
