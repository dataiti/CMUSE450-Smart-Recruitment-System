import { rootApi } from "../../../configs/rootApi";

const jobApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getListSearchJobs: builder.query({
      query: ({ search }) => {
        return {
          url: `/job/get-list-search-jobs?search=${search}`,
          method: "GET",
        };
      },
    }),
    getJobDetail: builder.query({
      query: ({ jobId }) => {
        return {
          url: `/job/get-job-detail/${jobId}`,
          method: "GET",
        };
      },
    }),
    getListOfJobs: builder.query({
      query: ({
        search,
        sortBy,
        orderBy,
        page,
        limit,
        experience,
        industry,
        jobType,
        gender,
        level,
        rating,
        salaryFrom,
        salaryTo,
      }) => {
        return {
          url: `/job/get-list-jobs?search=${search}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&experience=${experience}&industry=${industry}&jobType=${jobType}&gender=${gender}&level=${level}&rating=${rating}&salaryFrom=${salaryFrom}&salaryTo=${salaryTo}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetListSearchJobsQuery,
  useGetJobDetailQuery,
  useGetListOfJobsQuery,
} = jobApi;
