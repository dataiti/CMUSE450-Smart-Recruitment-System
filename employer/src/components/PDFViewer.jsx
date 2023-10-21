const PDFViewer = ({ url = "" }) => {
  return (
    <div>
      <iframe
        title="pdffile"
        src={`${url}&embedded=true`}
        className="border border-gray-400 rounded-md shadow-md !bg-white w-full min-h-[640px]"
      ></iframe>
    </div>
  );
};

export default PDFViewer;
