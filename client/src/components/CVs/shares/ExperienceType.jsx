import React, { useEffect, useRef, useState } from "react";
import ActionButtons from "./ActionButtons";
import TextEditCustomize from "./TextEditCustomize";

const ExperienceType = ({
  handleMoveUp,
  handleMoveDown,
  handleAddAbove,
  handleAddBelow,
  handleDelete,
  handleContentChange,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const divRef1 = useRef(null);
  const divRef2 = useRef(null);
  const absoluteDivRef = useRef(null);

  const handleFocusInput = () => {
    setIsFocus(true);
  };

  const handleClickOutside = (event) => {
    if (
      divRef1.current &&
      !divRef1.current.contains(event.target) &&
      divRef2.current &&
      !divRef2.current.contains(event.target)
    ) {
      setIsFocus(false);
    }
  };

  const updateAbsoluteDivSize = () => {
    if (divRef1.current && absoluteDivRef.current) {
      const width = divRef1.current.offsetWidth + 80;
      const height = divRef1.current.offsetHeight + 40;

      absoluteDivRef.current.style.width = `${width}px`;
      absoluteDivRef.current.style.height = `${height}px`;
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateAbsoluteDivSize();
    });

    if (divRef1.current) {
      resizeObserver.observe(divRef1.current);
    }

    document.addEventListener("mousedown", handleClickOutside);
    updateAbsoluteDivSize();

    return () => {
      if (divRef1.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resizeObserver.unobserve(divRef1.current);
      }
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`relative ${isFocus && "z-40"} block
      }`}
    >
      <div
        ref={divRef1}
        className={`flex w-full`}
        onClick={handleFocusInput}
        role="textbox"
        tabIndex="0"
      >
        <TextEditCustomize
          isFocus={isFocus}
          handleContentChange={handleContentChange}
          divRef={divRef1}
          html="01/2018 – Present"
          className={`bg-white z-20 font-bold w-[24%] px-1 py-[1px] text-sm rounded-none border-2 outline-none ${
            isFocus ? "border-gray-500" : "border-transparent"
          }`}
        />
        <div className="flex flex-col w-[76%]">
          <TextEditCustomize
            isFocus={isFocus}
            handleContentChange={handleContentChange}
            divRef={divRef2}
            html="F8 TECHNOLOGY EDUCATION.,JSC"
            className={`bg-white z-20 min-w-[30px] px-1 py-[1px] text-sm font-bold uppercase rounded-none border-2 outline-none ${
              isFocus ? "border-gray-500" : "border-transparent"
            }`}
          />
          <TextEditCustomize
            isFocus={isFocus}
            handleContentChange={handleContentChange}
            divRef={divRef2}
            html="Full-stack Developer<br>
                - Programme outsourcing projects<br>
                - Create coding frames and design database based on project descriptions"
            className={`bg-white z-20 min-w-[30px] px-1 py-[1px] text-sm font-medium rounded-none border-2 outline-none ${
              isFocus ? "border-gray-500" : "border-transparent"
            }`}
          />
        </div>
      </div>
      <ActionButtons
        isFocus={isFocus}
        absoluteDivRef={absoluteDivRef}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleAddAbove={handleAddAbove}
        handleAddBelow={handleAddBelow}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default ExperienceType;
