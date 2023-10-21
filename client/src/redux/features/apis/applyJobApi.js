import { rootApi } from "../../../configs/rootApi";

const applyJobApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    applyJob: builder.mutation({
      query: ({ data, userId, jobId, employerId }) => ({
        url: `/applyJob/apply-job/${userId}/${jobId}/${employerId}`,
        method: "POST",
        body: data,
      }),
    }),
    getListOfApplyJobs: builder.query({
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

export const { useApplyJobMutation, useLazyGetListOfApplyJobsQuery } =
  applyJobApi;
