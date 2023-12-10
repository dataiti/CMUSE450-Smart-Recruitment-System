import React from "react";

const TextEditCustomize = ({
  className = "",
  isFocus,
  handleContentChange,
  divRef,
  html,
}) => {
  return (
    <>
      <div
        ref={divRef}
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
