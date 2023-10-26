import { rootApi } from "../../../configs/rootApi";

const analyticApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    generateTimeBasedLineChart: builder.query({
      query: ({ userId, employerId, startDay, endDay, type, typeTime }) => {
        return {
          url: `/analytic/generate-time-based-line-chart/${userId}/${employerId}?startDay=${startDay}&endDay=${endDay}&type=${type}&typeTime=${typeTime}`,
          method: "GET",
        };
      },
    }),
    generateTimeBasedPieChartByIndustry: builder.query({
      query: ({ userId, employerId, type }) => {
        return {
          url: `/analytic/generate-time-based-pie-chart/${userId}/${employerId}?type=${type}`,
          method: "GET",
        };
      },
    }),
    getOveviewStatistics: builder.query({
      query: ({ userId, employerId, type }) => {
        return {
          url: `/analytic/get-oveview-statistics/${userId}/${employerId}?type=${type}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGenerateTimeBasedLineChartQuery,
  useGenerateTimeBasedPieChartByIndustryQuery,
  useGetOveviewStatisticsQuery,
} = analyticApi;
