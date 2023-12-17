import React from "react";

const PDFViewer = ({ url }) => {
  return (
    <object data={url} type="application/pdf" width="100%" height="100%">
      <p></p>
    </object>
  );
};

export default PDFViewer;
