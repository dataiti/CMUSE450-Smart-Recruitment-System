import { rootApi } from "../../../configs/rootApi";

const categoryApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getListOfCategories: builder.query({
      query: () => {
        return {
          url: `/category/get-list-categories`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetListOfCategoriesQuery } = categoryApi;
