import { rootApi } from "../../../configs/rootApi";

const candidateApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvaluateSuitableJob: builder.query({
      query: ({ userId, candidateId, jobId }) => {
        return {
          url: `/analytic/evaluate-suitable-job/${userId}/${candidateId}/${jobId}`,
          method: "GET",
        };
      },
    }),
    getTechnicalTrendingChart: builder.query({
      query: () => {
        return {
          url: "/analytic/get-technical-trending",
          method: "GET",
        };
      },
    }),
    getWorkPositionTrendingChart: builder.query({
      query: () => {
        return {
          url: "/analytic/get-work-position-trending",
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetEvaluateSuitableJobQuery,
  useGetTechnicalTrendingChartQuery,
  useGetWorkPositionTrendingChartQuery,
} = candidateApi;
