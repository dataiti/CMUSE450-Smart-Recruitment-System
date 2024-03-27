import React from "react";
import { icons } from "../../utils/icons";

const Search = ({
  searchValue,
  setSearchValue,
  setIsAddForm,
  placeholder,
  setSelected = () => {},
  setItem = () => {},
  setIsEditForm = () => {},
  setUtterValue = () => {},
  setTextValue = () => {},
}) => {
  return (
    <div className="h-[60px] px-4 border-b border-blue-gray-300 flex items-center gap-3">
      <span className="text-gray-600">
        <icons.FiSearch size={24} />
      </span>
      <input
        className="w-full outline-none border-none placeholder:text-sm"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button
        className="bg-blue-gray-800 rounded-md px-4 py-2 text-xs font-bold hover:bg-blue-gray-600 text-white transition-all"
        onClick={() => {
          setIsAddForm(true);
          setSelected("");
          setItem("");
          setIsEditForm(false);
          setUtterValue("");
          setTextValue("");
        }}
      >
        Thêm
      </button>
    </div>
  );
};

export default Search;
