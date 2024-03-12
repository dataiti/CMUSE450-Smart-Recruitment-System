import { rootApi } from "../../../configs/rootApi";

const rasaApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getStoriesData: builder.query({
      query: () => {
        return {
          url: "/rasa/stories/get-stories",
          method: "GET",
        };
      },
    }),
    addStory: builder.mutation({
      query: ({ data }) => {
        return {
          url: "/rasa/stories/add-story",
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
    deleteStory: builder.mutation({
      query: ({ storyName }) => {
        return {
          url: `/rasa/stories/delete-story?storyName=${storyName}`,
          method: "DELETE",
        };
      },
    }),
// -----------------------------
    getRulesData: builder.query({
      query: () => {
        return {
          url: "/rasa/rules/get-rules",
          method: "GET",
        };
      },
    }),
    addRule: builder.mutation({
      query: ({ data }) => {
        return {
          url: "/rasa/rules/add-rules",
          method: "POST",
          body: data,
        };
      },
    }),
    updateRule: builder.mutation({
      query: ({ data, ruleName }) => {
        return {
          url: `/rasa/rules/update-rule?ruleName=${ruleName}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    deleteRule: builder.mutation({
      query: ({ ruleName }) => {
        return {
          url: `/rasa/rules/delete-rule?ruleName=${ruleName}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetStoriesDataQuery,
  useAddStoryMutation,
  useDeleteStoryMutation,
  useUpdateStoryMutation,
  useGetRulesDataQuery,
  useAddRuleMutation,
  useDeleteRuleMutation,
  useUpdateRuleMutation,
} = rasaApi;
