import { IconButton, Typography } from "@material-tailwind/react";
import React from "react";
import ReactPaginate from "react-paginate";
import { icons } from "../../utils/icons";

const PaginationOption = ({
  isColumnCard,
  setIsColumnCard,
  count,
  totalPage,
  handlePageChange,
  page,
}) => {
  return (
    <div className="flex items-center justify-between">
      <Typography className="flex items-center gap-2 font-bold text-light-blue-600">
        <icons.FiSearch size={18} /> Tìm thấy {count} công việc
      </Typography>
      <div className="flex items-center gap-2">
        {isColumnCard ? (
          <IconButton
            className="shadow-none bg-white text-[#212f3f] !p-5 !rounded-md"
            onClick={() => setIsColumnCard(false)}
          >
            <icons.FaBars size={24} />
          </IconButton>
        ) : (
          <IconButton
            className="shadow-none bg-white text-[#212f3f] !p-5 !rounded-md"
            onClick={() => setIsColumnCard(true)}
          >
            <icons.FaGripVertical size={24} />
          </IconButton>
        )}
        <div className="bg-white p-1 rounded-md ">
          <ReactPaginate
            pageCount={totalPage}
            onPageChange={handlePageChange}
            forcePage={page - 1}
            containerClassName={"pagination"}
            nextLabel={<icons.IoArrowRedoCircleOutline size={36} />}
            previousLabel={<icons.IoArrowUndoCircleOutline size={36} />}
            activeClassName="!bg-[#212f3f] text-white text-gray-700 py-1 px-3 rounded-sm"
            pageClassName="bg-gray-200 text-gray-700 py-1 px-3 rounded-sm"
            className="flex items-center gap-2 text-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default PaginationOption;
