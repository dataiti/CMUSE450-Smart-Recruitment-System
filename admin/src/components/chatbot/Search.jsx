import React from "react";
import PropTypes from "prop-types";

import { icons } from "../../utils/icons";
import { ButtonCustom } from "../shares";

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
  const handleResetForm = () => {
    setIsAddForm(true);
    setSelected("");
    setItem("");
    setIsEditForm(false);
    setUtterValue("");
    setTextValue("");
  };

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
      <ButtonCustom
        className="bg-blue-gray-800 text-white"
        onClick={handleResetForm}
        size="sm"
      >
        Thêm
      </ButtonCustom>
    </div>
  );
};

Search.propTypes = {
  searchValue: PropTypes.string,
  placeholder: PropTypes.string,
  setSearchValue: PropTypes.func,
  setIsAddForm: PropTypes.func,
  setSelected: PropTypes.func,
  setItem: PropTypes.func,
  setIsEditForm: PropTypes.func,
  setUtterValue: PropTypes.func,
  setTextValue: PropTypes.func,
};

export default Search;
