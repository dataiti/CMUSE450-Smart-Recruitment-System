import React, { useRef, useEffect } from "react";
import { Input } from "@material-tailwind/react";
import PropTypes from "prop-types";

import { icons } from "../../utils/icons";
import { useDeleteIntentMutation } from "../../redux/features/apis/rasas/nluApi";
import { TypographyCustom } from "../shares";

const InputSelectCustom = ({
  label,
  value,
  listItem,
  isFocus,
  setValue,
  setListItem,
  setIsFocus,
  setListNLUData,
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
        spellCheck={false}
        ref={intentRef}
        value={value}
        color="blue"
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
                  <TypographyCustom text={item?.utterName || item} />
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
            <button className="text-light-blue-500 p-2 font-bold text-sm w-full h-full hover:bg-gray-200">
              Tạo một intent mới
            </button>
          </div>
        </div>
      )}
    </>
  );
};

InputSelectCustom.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  listItem: PropTypes.array,
  isFocus: PropTypes.bool,
  setValue: PropTypes.func,
  setListItem: PropTypes.func,
  setIsFocus: PropTypes.func,
  setListNLUData: PropTypes.func,
};

export default InputSelectCustom;
