import { rootApi } from "../../../configs/rootApi";

const employerApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployerDetail: builder.query({
      query: ({ employerId }) => {
        return {
          url: `/employer/get-employer-detail/${employerId}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetEmployerDetailQuery } = employerApi;
