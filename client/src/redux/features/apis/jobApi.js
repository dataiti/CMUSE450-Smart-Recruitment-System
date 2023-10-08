import { rootApi } from "../../../configs/rootApi";

const jobApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobDetail: builder.query({
      query: ({ userId, jobId }) => {
        return {
          url: `/job/get-job-detail/${userId}/${jobId}`,
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

export const { useGetJobDetailQuery, useGetListOfJobsQuery } = jobApi;