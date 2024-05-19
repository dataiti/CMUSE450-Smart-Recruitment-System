import React from "react";
import { icons } from "../../utils/icons";

const FlowRules = ({ steps = [] }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 ">
      {steps.map((item) => {
        return (
          <>
            {item.intent ? (
              <div className="flex flex-col items-center">
                <div className="px-4 py-3 text-sm font-bold rounded-full bg-blue-gray-800 text-white">
                  {item.intent}
                </div>
                <span className="text-gray-800">
                  <icons.FaLongArrowAltDown size={20} />
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="px-4 py-3 text-sm font-bold rounded-full border-2 border-gray-800 text-gray-800">
                  {item.action}
                </div>
                <span>
                  <icons.FaLongArrowAltDown size={20} />
                </span>
              </div>
            )}
          </>
        );
      })}
    </div>
  );
};

export default FlowRules;
