import { rootApi } from "../../../configs/rootApi";

const userApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getListUserForAdmin: builder.query({
      query: ({ userId, search = "", status, limit, page }) => {
        return {
          url: `/user/list-users/admin/${userId}?search=${search}&page=${page}&limit=${limit}&status=${status}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetListUserForAdminQuery } = userApi;
