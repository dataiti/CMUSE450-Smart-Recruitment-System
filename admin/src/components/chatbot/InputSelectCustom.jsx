import React from "react";
import { Input, Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { useRef } from "react";
import { useEffect } from "react";
import { useDeleteIntentMutation } from "../../redux/features/apis/rasas/nluApi";

const InputSelectCustom = ({
  setValue,
  value,
  listItem,
  setListItem,
  setIsFocus,
  isFocus,
  setListNLUData,
  label,
}) => {
  const [deleteIntent] = useDeleteIntentMutation();

  const intentRef = useRef();

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (e) => {
    if (intentRef.current && !intentRef.current.contains(e.target)) {
      setIsFocus(false);
    }
  };

  const handleDeleteItem = async ({ intentName }) => {
    try {
      const res = await deleteIntent({ intentName: intentName });
      if (res && res.data) {
        setListItem((prev) => prev.filter((intent) => intent !== intentName));
        setListNLUData((prev) =>
          prev.filter((intent) => intent.intent !== intentName)
        );
        setValue("");
      }
    } catch (error) {}
  };

  return (
    <>
      <Input
        className="bg-white"
        label={label}
        icon={<icons.FiChevronDown />}
        spellCheck="false"
        ref={intentRef}
        value={value}
        // onKeyDown={handleEnterKeywordSearch}
        onChange={(e) => {
          setValue(e.target.value);
          setIsFocus(true);
        }}
        onFocus={() => setIsFocus(true)}
      />
      {listItem && isFocus && (
        <div className="absolute top-[108%] w-full bg-white shadow-md rounded-md ">
          <ul className="h-[200px] overflow-y-auto">
            {listItem?.map((item, index) => {
              return (
                <li
                  className="cursor-pointer hover:bg-gray-100 p-3 transition-all flex items-center justify-between"
                  onClick={() => setValue(item?.utterName || item)}
                  key={`${item || item?.utterName}-${index}`}
                >
                  <Typography className="text-sm font-bold text-gray-600 ">
                    {item?.utterName || item}
                  </Typography>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() =>
                      handleDeleteItem({ intentName: item?.utterName })
                    }
                  >
                    <icons.IoIosCloseCircle size={20} />
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t">
            <button
              className="text-light-blue-500 p-2 font-bold text-sm w-full h-full hover:bg-gray-200"
              // onClick={handleAddNewIntent}
            >
              Tạo một intent mới
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InputSelectCustom;
