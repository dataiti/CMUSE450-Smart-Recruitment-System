import { rootApi } from "../../../configs/rootApi";

const employerApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getListOfEmployerForAdmin: builder.query({
      query: ({ userId, search, sortBy, orderBy, page, limit, status }) => {
        return {
          url: `/employer/list-employers/admin/${userId}?search=${search}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&status=${status}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetListOfEmployerForAdminQuery } = employerApi;
