import React, { useState, useRef, useEffect } from "react";
import {
  ExperienceInput,
  InfoInput,
  ProjectInput,
  TextInput,
  TitleInput,
} from "./InputCVCustom";
import ActionButtons from "./ActionsButton";

const InputEditCV = ({
  type = "text",
  label = "",
  value = "",
  description = "",
  isBlock = true,
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

  const handleClickDelete = () => {
    console.log(123);
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
      className={`relative ${isFocus && "z-40"} ${
        isBlock ? "block" : "inline-block"
      }`}
    >
      <div
        ref={divRef1}
        className={`flex w-full ${type === "project" && "flex-col"}`}
        onClick={handleFocusInput}
        role="textbox"
        tabIndex="0"
      >
        {type === "title" && <TitleInput value={value} divRef2={divRef2} />}
        {type === "info" && (
          <InfoInput
            divRef1={divRef1}
            divRef2={divRef2}
            label={label}
            isFocus={isFocus}
            value={value}
            isBlock={isBlock}
          />
        )}
        {type === "experience" && (
          <ExperienceInput
            divRef1={divRef1}
            divRef2={divRef2}
            label={label}
            isFocus={isFocus}
            value={value}
            description={description}
          />
        )}
        {type === "project" && (
          <ProjectInput divRef2={divRef2} isFocus={isFocus} />
        )}
        {type === "text" && (
          <TextInput divRef2={divRef2} isFocus={isFocus} value={value} />
        )}
      </div>
      <ActionButtons
        isFocus={isFocus}
        absoluteDivRef={absoluteDivRef}
        handleClickDelete={handleClickDelete}
      />
    </div>
  );
};

export default InputEditCV;
