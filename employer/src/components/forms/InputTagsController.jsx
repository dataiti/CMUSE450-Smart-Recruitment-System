import React, { useState } from "react";
import { IconButton, Typography } from "@material-tailwind/react";
import { Controller } from "react-hook-form";
import { icons } from "../../utils/icons";
import { useEffect } from "react";

const InputTagsController = ({
  name,
  control,
  label,
  error,
  isDisabled = false,
  defaultTags = [],
}) => {
  const [tags, setTags] = useState(() => defaultTags);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    if (e && e.target) {
      setInputValue(e.target.value.toLowerCase());
    }
  };

  const handleAddTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };

  return (
    <div className="flex flex-col relative ml-8 w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="w-full grid grid-cols-4">
            <label className="col-span-1 text-base font-bold whitespace-no-wrap text-teal-800">
              {label}
            </label>
            <div className="col-span-2 flex items-center flex-wrap gap-2 relative w-full p-2 border border-gray-400 rounded-md">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-50 text-blue-500 border border-blue-500 py-1 px-2 rounded-md"
                >
                  {tag}
                  <span
                    onClick={() => {
                      handleTagRemove(tag);
                      field.onChange(tags.filter((tagItem) => tagItem !== tag));
                    }}
                    className="ml-2 cursor-pointer"
                  >
                    <icons.AiFillCloseCircle />
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nhập kỹ năng"
                  className="outline-none border p-2 border-gray-400 rounded-md"
                  value={inputValue}
                  onChange={(e) => {
                    handleInputChange(e);
                    field.onChange(e.target.value);
                  }}
                />
                <IconButton
                  onClick={() => {
                    handleAddTag();
                    field.onChange([...tags, inputValue]);
                  }}
                  className="bg-teal-900 text-3xl font-bold"
                >
                  +
                </IconButton>
              </div>
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

export default InputTagsController;
