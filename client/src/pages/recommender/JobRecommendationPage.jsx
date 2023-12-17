import React, { useState } from "react";
import { useGetRecommentJobForCandidateQuery } from "../../redux/features/apis/recommenderApi";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import {
  Loading,
  SelectCustom,
  PaginationOption,
  Followings,
} from "../../components/shares";
import { Link } from "react-router-dom";
import { Breadcrumbs, Input, Typography } from "@material-tailwind/react";
import { JobCard, JobCardSmall } from "../../components/jobs";
import { useDebounce } from "../../hooks";
import { icons } from "../../utils/icons";
import { orderByOptions, sortByOptions } from "../../utils/constants";

const JobRecommendationPage = () => {
  const { user } = useSelector(authSelect);

  const [sortBy, setSortBy] = useState("asc");
  const [orderBy, setOrderBy] = useState("_id");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [isColumnCard, setIsColumnCard] = useState(true);

  const searchDebouceValue = useDebounce(search, 800);

  const { data: recommentJobsData, isFetching } =
    useGetRecommentJobForCandidateQuery(
      {
        userId: user?._id,
        search: searchDebouceValue,
        sortBy,
        orderBy,
        page,
        limit,
      },
      { refetchOnMountOrArgChange: true }
    );

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  return (
    <div className="px-[110px] py-[20px] flex flex-col gap-2">
      {isFetching && <Loading />}
      <Breadcrumbs fullWidth className="bg-white">
        <Link to="/" className="text-light-blue-500 text-sm font-bold">
          Trang chủ
        </Link>
        <Link to="/recommender-job" className="font-bold text-sm">
          Đề xuất công việc phù hợp
        </Link>
      </Breadcrumbs>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 flex flex-col gap-2">
          <div className="w-full bg-gradient-to-r from-[#304352] to-[#cbd5e1] rounded-md px-10 py-5">
            <Typography className="text-2xl font-bold text-white">
              Đề xuất công việc phù hợp
            </Typography>
            <Typography className="text-sm font-bold text-white">
              Hệ thống Gợi ý Công việc kết hợp cả hai thuật toán: Collaborative
              Filtering và Content-Based Filtering để tạo ra một trải nghiệm cá
              nhân hóa cho ứng viên. Kết hợp 2 thuật toán trên lại sẽ là Hybrid
              Filtering, kết quả là một danh sách các công việc được đề xuất dựa
              trên sở thích và kỹ năng cá nhân của ứng viên, mang lại trải
              nghiệm gợi ý cá nhân và đa dạng trong sự nghiệp của họ.
            </Typography>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-4 gap-2 bg-gradient-to-r from-[#304352] to-[#cbd5e1] rounded-md p-3 sticky z-20 top-[80px]">
                <div className="col-span-2">
                  <Input
                    label="Nhập công việc tìm kiếm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    icon={
                      isFetching && (
                        <span className="animate-spin text-gray-600">
                          <icons.BiLoaderCircle size={24} />
                        </span>
                      )
                    }
                    className="bg-white"
                  />
                </div>
                <div>
                  <SelectCustom
                    label="Sắp xếp theo"
                    options={sortByOptions}
                    value={sortBy}
                    onChange={(e) => setSortBy(e)}
                  />
                </div>
                <div>
                  <SelectCustom
                    label="Thứ tự theo"
                    options={orderByOptions}
                    value={orderBy}
                    onChange={(e) => setOrderBy(e)}
                  />
                </div>
              </div>
              <PaginationOption
                count={recommentJobsData?.count}
                handlePageChange={handlePageChange}
                isColumnCard={isColumnCard}
                page={page}
                setIsColumnCard={setIsColumnCard}
                totalPage={recommentJobsData?.totalPage}
              />
              <div
                className={`${
                  isColumnCard ? "grid grid-cols-2" : "flex flex-col"
                } gap-2`}
              >
                {recommentJobsData?.data?.length > 0 &&
                  recommentJobsData?.data?.map((jobItem) => {
                    return (
                      <JobCardSmall jobItem={jobItem} key={jobItem?._id} />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <Followings />
        </div>
      </div>
    </div>
  );
};

export default JobRecommendationPage;
