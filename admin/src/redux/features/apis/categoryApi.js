import { rootApi } from "../../../configs/rootApi";

const categoryApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getListOfCategoriesForAdmin: builder.query({
      query: ({ userId, search, sortBy, orderBy, page, limit, status }) => {
        return {
          url: `/category/get-list-categories/admin/${userId}?search=${search}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&status=${status}`,
          method: "GET",
        };
      },
    }),
    toggleActiveCategory: builder.mutation({
      query: ({ userId, categoryId }) => {
        return {
          url: `/category/toggle-active/admin/${userId}/${categoryId}`,
          method: "PUT",
        };
      },
    }),
  }),
});

export const {
  useGetListOfCategoriesForAdminQuery,
  useToggleActiveCategoryMutation,
} = categoryApi;
