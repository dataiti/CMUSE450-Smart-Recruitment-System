import React, { useEffect, useRef, useState } from "react";
import ActionButtons from "./ActionButtons";
import TextEditCustomize from "./TextEditCustomize";

const ParentType = ({
  handleMoveUp,
  handleMoveDown,
  handleAddAbove,
  handleAddBelow,
  handleDelete,
  handleContentChange,
  children,
  title,
  color,
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
      const width = divRef1.current.offsetWidth + 140;
      const height = divRef1.current.offsetHeight + 94;

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
        className={`flex w-full flex-col`}
        onClick={handleFocusInput}
        role="textbox"
        tabIndex="0"
      >
        <div className="flex flex-col gap-[2px]">
          <div className="flex">
            <TextEditCustomize
              isFocus={isFocus}
              handleContentChange={handleContentChange}
              divRef={divRef2}
              html={title}
              className={` bg-white z-20 min-w-[30px] text-base uppercase font-extrabold ${
                color.color
              } rounded-none border-2 outline-none ${
                isFocus ? "border-gray-500" : "border-transparent"
              }`}
              isHidden
            />
          </div>
          <div className={`h-[2px] w-full bg-blue-gray-100`}></div>
          <div>{children}</div>
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
        className="p-6 bg-blue-gray-900 opacity-60"
      />
    </div>
  );
};

export default ParentType;
