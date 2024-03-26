import React from "react";
import PropTypes from "prop-types";
import MonacoEditor from "@monaco-editor/react";
import jsyaml from "js-yaml";
import { toast } from "react-toastify";

const YamlEditorCustom = ({ yamlValue, setYamlValue }) => {
  // Hàm xử lý sự kiện onchange của yaml editor
  const handleChange = (newValue) => {
    try {
      jsyaml.load(newValue);
      setYamlValue(newValue);
    } catch (error) {
      console.error("YAML Error:", error.message);
      toast.error("Sai cu phap kia");
    }
  };

  return (
    <div className="w-full h-full">
      <MonacoEditor
        width="100%"
        height="100%"
        language="yaml"
        theme="hc-white"
        value={yamlValue}
        options={{ selectOnLineNumbers: true, automaticLayout: true }}
        onChange={handleChange}
        fontSize={18}
      />
    </div>
  );
};

YamlEditorCustom.propTypes = {
  yamlValue: PropTypes.string,
  setYamlValue: PropTypes.func,
};

export default YamlEditorCustom;
