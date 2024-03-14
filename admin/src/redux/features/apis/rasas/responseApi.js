import { rootApi } from "../../../../configs/rootApi";

const responseApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getResponses: builder.query({
      query: () => {
        return {
          url: "/rasa/response/get-responses",
          method: "GET",
        };
      },
    }),
    getListUtters: builder.query({
      query: () => {
        return {
          url: "/rasa/response/get-list-utters",
          method: "GET",
        };
      },
    }),
    getUtterItem: builder.query({
      query: ({ utterName }) => {
        return {
          url: `/rasa/response/get-utter-item?utterName=${utterName}`,
          method: "GET",
        };
      },
    }),
    addUtterItem: builder.mutation({
      query: ({ data }) => {
        return {
          url: "/rasa/response/add-utter-item",
          method: "POST",
          body: data,
        };
      },
    }),
    updateUtterItem: builder.mutation({
      query: ({ data }) => {
        return {
          url: `/rasa/response/update-utter-item`,
          method: "PUT",
          body: data,
        };
      },
    }),
    deleteUtter: builder.mutation({
      query: ({ utterName }) => {
        return {
          url: `/rasa/response/delete-utter?utterName=${utterName}`,
          method: "DELETE",
        };
      },
    }),
    deleteUtterItem: builder.mutation({
      query: ({ utterName, textContent }) => {
        return {
          url: `/rasa/response/delete-utter-item?utterName=${utterName}&textContent=${textContent}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetListUttersQuery,
  useGetResponsesQuery,
  useGetUtterItemQuery,
  useAddUtterItemMutation,
  useUpdateUtterItemMutation,
  useDeleteUtterMutation,
  useDeleteUtterItemMutation,
} = responseApi;
