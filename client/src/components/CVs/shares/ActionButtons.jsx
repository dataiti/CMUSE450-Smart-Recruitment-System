import React from "react";
import { icons } from "../../../utils/icons";

const ActionButtons = ({
  absoluteDivRef,
  isFocus,
  handleMoveUp,
  handleMoveDown,
  handleAddAbove,
  handleAddBelow,
  handleDelete,
  className = "",
}) => {
  return (
    <>
      <div
        ref={absoluteDivRef}
        className={`absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-lg group ${
          isFocus ? "bg-blue-gray-100 opacity-50" : "bg-transparent"
        } ${className}`}
      >
        {isFocus && (
          <span
            className="absolute top-[50%] -translate-y-[50%] right-2 cursor-pointer text-cyan-500 hover:text-teal-800 group-hover:opacity-100 transition-all"
            onMouseDown={handleDelete}
          >
            <icons.FaDeleteLeft size={24} />
          </span>
        )}
        {isFocus && (
          <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-1">
            <span
              className="cursor-pointer text-cyan-500 hover:text-teal-800 group-hover:opacity-100 transition-all"
              onMouseDown={handleMoveUp}
            >
              <icons.FaCircleChevronUp size={20} />
            </span>
            <span
              className="cursor-pointer text-cyan-500 hover:text-teal-800 group-hover:opacity-100 transition-all"
              onMouseDown={handleMoveDown}
            >
              <icons.FaCircleChevronDown size={20} />
            </span>
          </div>
        )}
        {isFocus && (
          <span
            className="absolute -translate-y-[50%] -top-4 left-2 cursor-pointer text-cyan-500 hover:text-teal-800 group-hover:opacity-100 transition-all"
            onMouseDown={handleAddAbove}
          >
            <icons.FaCirclePlus size={20} />
          </span>
        )}
        {isFocus && (
          <span
            className="absolute -translate-y-[50%] -bottom-9 left-2 cursor-pointer text-cyan-500 hover:text-teal-800 group-hover:opacity-100 transition-all"
            onMouseDown={handleAddBelow}
          >
            <icons.FaCirclePlus size={20} />
          </span>
        )}
      </div>
    </>
  );
};

export default ActionButtons;
