import React from "react";
import { icons } from "../../../utils/icons";

const Menu = ({ isFocus }) => {
  return (
    <>
      {isFocus && (
        <div
          className={`absolute z-20 flex items-center gap-2 bottom-[100%] right-10 rounded-tr-md rounded-tl-md px-5 py-2 group text-white ${
            isFocus ? "bg-blue-gray-900 opacity-50" : "bg-transparent"
          } `}
        >
          <button>
            <icons.AiOutlineBold size={20} />
          </button>
          <button>
            <icons.AiOutlineItalic size={20} />
          </button>
          <button>
            <icons.AiOutlineUnderline size={20} />
          </button>
          <button>
            <icons.FaListUl size={20} />
          </button>
        </div>
      )}
    </>
  );
};

export default Menu;
