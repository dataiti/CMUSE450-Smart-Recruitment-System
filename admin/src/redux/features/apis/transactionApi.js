import { rootApi } from "../../../configs/rootApi";

const transactionApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getListTransactionsForAdmin: builder.query({
      query: ({ userId, search, sortBy, orderBy, page, limit, status }) => {
        return {
          url: `/transaction/get-list-transactions/admin${userId}?search=${search}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&status=${status}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetListTransactionsForAdminQuery } = transactionApi;
