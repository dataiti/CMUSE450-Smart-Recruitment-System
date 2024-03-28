import { rootApi } from "../../../../configs/rootApi";

const nluApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getNLUData: builder.query({
      query: () => {
        return {
          url: "/rasa/nlu/get-nlu",
          method: "GET",
        };
      },
    }),
    getListIntens: builder.query({
      query: () => {
        return {
          url: "/rasa/nlu/get-list-intent",
          method: "GET",
        };
      },
    }),
    addIntentItem: builder.mutation({
      query: ({ data }) => {
        return {
          url: "/rasa/nlu/add-intent-item",
          method: "POST",
          body: data,
        };
      },
    }),
    updateStory: builder.mutation({
      query: ({ data, storyName }) => {
        return {
          url: `/rasa/stories/update-story?storyName=${storyName}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    deleteIntent: builder.mutation({
      query: ({ intentName }) => {
        return {
          url: `/rasa/nlu/delete-intent?intentName=${intentName}`,
          method: "DELETE",
        };
      },
    }),
    deleteExampleItem: builder.mutation({
      query: ({ intentName, exampleItem }) => {
        return {
          url: `/rasa/nlu/delete-example-item?intentName=${intentName}&exampleItem=${exampleItem}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetNLUDataQuery,
  useGetListIntensQuery,
  useAddIntentItemMutation,
  useUpdateStoryMutation,
  useDeleteExampleItemMutation,
  useDeleteIntentMutation,
} = nluApi;
