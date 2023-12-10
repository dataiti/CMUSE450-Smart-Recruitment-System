import React, { useState, useRef, useEffect } from "react";
import {
  ExperienceInput,
  InfoInput,
  PartInput,
  ProjectInput,
  SkillInput,
  TextInput,
  TitleInput,
} from "./InputCVCustom";
import ActionButtons from "./ActionsButton";

const InputEditCV = ({
  type = "text",
  isBlock = true,
  handleMoveUp,
  handleMoveDown,
  handleAddAbove,
  handleAddBelow,
  handleDelete,
  dangerouslySetInnerHTML,
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
        {type === "title" && (
          <TitleInput
            divRef2={divRef2}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
            handleContentChange={handleContentChange}
          />
        )}
        {type === "info" && (
          <InfoInput
            divRef1={divRef1}
            divRef2={divRef2}
            isFocus={isFocus}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
            handleContentChange={handleContentChange}
          />
        )}
        {type === "experience" && (
          <ExperienceInput
            divRef1={divRef1}
            divRef2={divRef2}
            isFocus={isFocus}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
            handleContentChange={handleContentChange}
          />
        )}
        {type === "project" && (
          <ProjectInput
            divRef2={divRef2}
            isFocus={isFocus}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
            handleContentChange={handleContentChange}
          />
        )}
        {type === "overview" && (
          <TextInput
            divRef2={divRef2}
            isFocus={isFocus}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
            handleContentChange={handleContentChange}
          />
        )}
        {type === "skill" && (
          <SkillInput
            divRef2={divRef2}
            isFocus={isFocus}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
            handleContentChange={handleContentChange}
          />
        )}
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

export default InputEditCV;
