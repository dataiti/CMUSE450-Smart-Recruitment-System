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
        candidateId,
      }) => {
        return {
          url: `/job/get-list-jobs?search=${search}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&experience=${experience}&industry=${industry}&jobType=${jobType}&gender=${gender}&level=${level}&rating=${rating}&candidateId=${candidateId}`,
          method: "GET",
        };
      },
    }),
    getListOfJobsForHomaPage: builder.query({
      query: ({ userId, limit }) => {
        return {
          url: `/job/get-list-jobs/homepage?limit=${limit}&userId=${userId}`,
          method: "GET",
        };
      },
    }),
    getListJobsByCompany: builder.query({
      query: ({ employerId, limit }) => {
        return {
          url: `/job/get-list-jobs/company?limit=${limit}&employerId=${employerId}`,
          method: "GET",
        };
      },
    }),
    getListSimilarJobs: builder.query({
      query: ({ jobId, industry }) => {
        return {
          url: `/job/get-list-similar-jobs?industry=${industry}&jobId=${jobId}`,
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
  useGetListOfJobsForHomaPageQuery,
  useGetListJobsByCompanyQuery,
  useGetListSimilarJobsQuery,
} = jobApi;
