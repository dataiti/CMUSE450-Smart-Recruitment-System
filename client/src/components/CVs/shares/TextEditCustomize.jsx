import React from "react";

const TextEditCustomize = ({
  className = "",
  handleContentChange,
  divRef,
  html,
  editableRef,
}) => {
  return (
    <>
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
