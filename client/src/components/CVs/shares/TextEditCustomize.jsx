import React, { useRef } from "react";
import { icons } from "../../../utils/icons";

const TextEditCustomize = ({
  className = "",
  handleContentChange,
  divRef,
  html,
  isFocus,
  isHidden = false,
}) => {
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
    <>
      {isFocus && isHidden && (
        <div className="absolute right-2 -top-[46px] flex items-center z-20 bg-blue-gray-900 gap-2 px-4 py-2 rounded-bl-md rounded-br-md">
          <button onClick={handleBoldClick} className="text-white">
            <icons.AiOutlineBold size={20} />
          </button>
          <button onClick={handleItalicClick} className="text-white">
            <icons.AiOutlineItalic size={20} />
          </button>
          <button onClick={handleUnderlineClick} className="text-white">
            <icons.AiOutlineUnderline size={20} />
          </button>
        </div>
      )}
      <div
        ref={(ref) => {
          if (divRef) divRef.current = ref;
          if (editableRef) editableRef.current = ref;
        }}
        className={className}
        spellCheck={false}
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: html }}
        onBlur={handleContentChange}
      />
    </>
  );
};

export default TextEditCustomize;
