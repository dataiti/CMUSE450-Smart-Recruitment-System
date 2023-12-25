import React from "react";
import { Controller } from "react-hook-form";
import { icons } from "../../utils/icons";
import { Typography } from "@material-tailwind/react";

const InputPDFController = ({
  control,
  namePDFFile,
  setNamePDFFile,
  isField = false,
  name,
}) => {
  return (
    <div className={`flex flex-col relative w-full ${!isField && "ml-10 "}`}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange } }) => (
          <div
            className={`${
              isField ? "flex flex-col gap-2" : "grid grid-cols-4"
            }`}
          >
            <label className="text-sm font-bold text-teal-800">Chọn CV:</label>
            <label
              htmlFor="CVpdf"
              className="flex items-center gap-2 border border-gray-400 rounded-md px-4 py-2 w-[220px] cursor-pointer hover:bg-gray-100"
            >
              <icons.BsFiletypePdf size={18} />
              <Typography className="text-xs font-bold text-blue-gray-500">
                Tải lên CV từ máy tính
              </Typography>
            </label>
            <input
              type="file"
              id={name}
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                setNamePDFFile(file.name);
                return onChange(e.target.files[0]);
              }}
            />
            <Typography className="text-xs font-bold text-blue-gray-500">
              {namePDFFile}
            </Typography>
          </div>
        )}
      />
    </div>
  );
};

export default InputPDFController;
