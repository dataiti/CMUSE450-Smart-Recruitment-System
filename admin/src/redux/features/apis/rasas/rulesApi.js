import { rootApi } from "../../../../configs/rootApi";

const rulesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRulesData: builder.query({
      query: () => {
        return {
          url: "/rasa/rules/get-rules",
          method: "GET",
        };
      },
    }),
    getRule: builder.query({
      query: ({ ruleName }) => {
        return {
          url: `/rasa/rules/get-rule?ruleName=${ruleName}`,
          method: "GET",
        };
      },
    }),
    addRule: builder.mutation({
      query: ({ data }) => {
        return {
          url: "/rasa/rules/add-rule",
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
  useAddRuleMutation,
  useDeleteRuleMutation,
  useGetAllRulesDataQuery,
  useUpdateRuleMutation,
  useGetRuleQuery,
} = rulesApi;
