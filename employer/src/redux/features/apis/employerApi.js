import { rootApi } from "../../../configs/rootApi";

const employerApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployerDetail: builder.query({
      query: ({ userId, employerId }) => {
        return {
          url: `/employer/get-employer-detail/${userId}/${employerId}`,
          method: "GET",
        };
      },
    }),
    registerEmployer: builder.mutation({
      query: ({ formData, userId }) => {
        return {
          url: `/employer/register-employer/${userId}`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useRegisterEmployerMutation, useGetEmployerDetailQuery } =
  employerApi;
