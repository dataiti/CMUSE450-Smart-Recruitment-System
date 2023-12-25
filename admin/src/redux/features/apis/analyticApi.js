import { rootApi } from "../../../configs/rootApi";

const analyticApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    generateTimeBasedLineChartForAdmin: builder.query({
      query: ({ userId, employerId, startDay, endDay, type, typeTime }) => {
        return {
          url: `/analytic/generate-time-based-line-chart/admin/${userId}?startDay=${startDay}&endDay=${endDay}&type=${type}&typeTime=${typeTime}`,
          method: "GET",
        };
      },
    }),
    generateTimeBasedPieChartForAdmin: builder.query({
      query: ({ userId, type }) => {
        return {
          url: `/analytic/generate-time-based-pie-chart/admin/${userId}?type=${type}`,
          method: "GET",
        };
      },
    }),
    getOveviewStatistics: builder.query({
      query: ({ userId }) => {
        return {
          url: `/analytic/get-oveview-statistics/admin/${userId}`,
          method: "GET",
        };
      },
    }),
    getTechnicalAndWorkPositionTrendingChart: builder.query({
      query: ({ type }) => {
        return {
          url: `/analytic/get-technical-trending?type=${type}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGenerateTimeBasedLineChartForAdminQuery,
  useGenerateTimeBasedPieChartForAdminQuery,
  useGetOveviewStatisticsQuery,
  useGetTechnicalAndWorkPositionTrendingChartQuery,
} = analyticApi;
