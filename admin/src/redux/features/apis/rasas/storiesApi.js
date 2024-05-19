import { rootApi } from "../../../../configs/rootApi";

const storiesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getStoriesData: builder.query({
      query: () => {
        return {
          url: "/rasa/stories/get-stories",
          method: "GET",
        };
      },
    }),
    getStory: builder.query({
      query: ({ storyName }) => {
        return {
          url: `/rasa/stories/get-story?storyName=${storyName}`,
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
  useGetStoryQuery,
  useAddStoryMutation,
  useDeleteStoryMutation,
  useUpdateStoryMutation,
<<<<<<< HEAD:admin/src/redux/features/apis/rasaApi.js
  useGetRulesDataQuery,
  useAddRuleMutation,
  useDeleteRuleMutation,
  useUpdateRuleMutation,
} = rasaApi;
=======
} = storiesApi;
>>>>>>> c0b77fc652333b77d220c7f0f07a50307ff9f19f:admin/src/redux/features/apis/rasas/storiesApi.js
