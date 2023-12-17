import React, { useEffect, useRef, useState } from "react";
import ActionButtons from "./ActionButtons";
import TextEditCustomize from "./TextEditCustomize";
import Menu from "./Menu";

const TextType = ({
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

      if (divRef1.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resizeObserver.unobserve(editableRef.current);
      }
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const editableRef = useRef(null);

  const handleBoldClick = () => {
    document.execCommand("bold", false, null);
  };

  const handleItalicClick = () => {
    document.execCommand("italic", false, null);
  };

  const handleUnderlineClick = () => {
    document.execCommand("underline", false, null);
  };

  return (
    <div className={`relative ${isFocus && "z-40"} block`}>
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
          divRef={divRef2}
          editableRef={editableRef}
          html="- Over 2 years of experience in programming with good communication and quick learning skills<br>
              - Strengths: Front-end technology and Back-end web application development<br>
              - Proficiency in HTML, CSS, JavaScript<br>
              - Experience with popular React.js workflows (such as Flux or Redux)<br>
              - Familiarity with RESTful APIs<br>
              - Strong Experience in: PHP, JavaScript (ReactJS, React-native), MySQL, NoSQL, GraphQL, Redis, JSON, API, Docker, Kubernetes, Rancher, AWS services<br>"
          className={`bg-white z-20 min-w-[30px] px-1 py-[1px] text-sm font-medium rounded-none border-2 outline-none ${
            isFocus ? "border-gray-500" : "border-transparent"
          }`}
        />
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
      <Menu
        isFocus={isFocus}
        handleBoldClick={handleBoldClick}
        handleItalicClick={handleItalicClick}
        handleUnderlineClick={handleUnderlineClick}
      />
    </div>
  );
};

export default TextType;
