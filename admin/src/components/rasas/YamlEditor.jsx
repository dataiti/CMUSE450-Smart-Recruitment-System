import React from "react";
import MonacoEditor from "@monaco-editor/react";

const YamlEditorCustom = ({ yamlValue, setYamlValue, handleChange }) => {
  const editorOptions = {
    selectOnLineNumbers: true,
    automaticLayout: true,
  };

  return (
    <div className="w-full h-full">
      <MonacoEditor
        width="100%"
        height="100%"
        language="yaml"
        theme="hc-white"
        value={yamlValue}
        options={editorOptions}
        onChange={handleChange}
        fontSize={18}
      />
    </div>
  );
};

export default YamlEditorCustom;
