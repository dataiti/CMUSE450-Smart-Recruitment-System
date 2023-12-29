import TextEditCustomize from "./TextEditCustomize";
import { useBaseType } from "../../../hooks";

const InfoType = ({ html1 = "", html2, handleContentChange }) => {
  const { isFocus, divRef1, divRef2, handleFocusInput } = useBaseType(
    handleContentChange,
    "Main",
    80,
    40
  );

  return (
    <div className={`relative ${isFocus && "z-40"} block`}>
      <div
        ref={divRef1}
        className="flex w-full"
        onClick={handleFocusInput}
        role="textbox"
        tabIndex="0"
      >
        <TextEditCustomize
          isFocus={isFocus}
          handleContentChange={handleContentChange}
          divRef={divRef2}
          html={html1}
          className={`whitespace-nowrap bg-white z-20 font-bold px-1 py-[1px] text-sm rounded-none border-2 outline-none ${
            isFocus ? "border-gray-500" : "border-transparent"
          }`}
        />
        <TextEditCustomize
          isFocus={isFocus}
          handleContentChange={handleContentChange}
          divRef={divRef2}
          html={html2}
          className={`whitespace-nowrap bg-white z-20 px-1 py-[1px] text-sm rounded-none border-2 outline-none ${
            isFocus ? "border-gray-500" : "border-transparent"
          }`}
        />
      </div>
    </div>
  );
};

export default InfoType;
