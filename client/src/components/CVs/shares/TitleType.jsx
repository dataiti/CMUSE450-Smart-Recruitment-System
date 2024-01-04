import React from "react";
import TextEditCustomize from "./TextEditCustomize";
import { useBaseType } from "../../../hooks";

const TitleType = ({ handleContentChange, color }) => {
  const { isFocus, divRef2 } = useBaseType(handleContentChange, "Main", 80, 40);

  return (
    <>
      <TextEditCustomize
        isFocus={isFocus}
        handleContentChange={handleContentChange}
        divRef={divRef2}
        spellCheck={false}
        html="Nguyen Van A"
        onBlur={handleContentChange}
        className={`bg-white text-3xl uppercase z-20 min-w-[30px] px-1 py-[2px] font-extrabold rounded-none border-2 outline-none ${
          color.color
        } ${isFocus ? "border-gray-500" : "border-transparent"}`}
      />
    </>
  );
};

export default TitleType;
