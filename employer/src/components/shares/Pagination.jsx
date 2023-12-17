import React, { memo } from "react";
import ReactPaginate from "react-paginate";
import { icons } from "../../utils/icons";

const Pagination = ({
  totalPage,
  handlePageChange,
  page,
  limit,
  setLimit,
  className = "",
}) => {
  return (
    <div className={`p-1 flex items-center justify-between ${className}`}>
      <ReactPaginate
        pageCount={totalPage}
        onPageChange={handlePageChange}
        forcePage={page - 1}
        containerClassName={"pagination"}
        nextLabel={<icons.IoArrowRedoCircleOutline size={36} />}
        previousLabel={<icons.IoArrowUndoCircleOutline size={36} />}
        activeClassName="!bg-[#212f3f] text-white text-gray-700 py-1 rounded-sm"
        pageClassName="bg-gray-200 text-gray-700 py-1 px-3 rounded-sm"
        className="flex items-center gap-2 text-gray-700"
      />
      <div>
        <span className="text-sm text-gray-700 mx-3">Số dòng trên trang</span>
        <input
          type="number"
          placeholder="số dòng"
          className={`outline-none pl-2 py-1 bg-gray-200 w-20 rounded-sm border-1 border-gray-300 text-sm ${className}`}
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
      </div>
    </div>
  );
};

export default memo(Pagination);
