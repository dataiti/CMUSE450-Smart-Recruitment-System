import { createSlice } from "@reduxjs/toolkit";

const rulesSlice = createSlice({
  name: "rules",
  initialState: {
    listRules: [],
    selectedRule: null,
  },
  reducers: {
    setListRules: (state, action) => {
      state.listRules = action.payload.data;
      if (action.payload.data && !state.selectedRule)
        state.selectedRule = action.payload?.data[0];
    },
    addRule: (state, action) => {
      state.listRules.push(action.action.data);
    },
    removeRuleItem: (state, action) => {
      const ruleIndex = state.listRules.findIndex(
        (item) => item.rule === action.payload.data.rule
      );
      if (ruleIndex !== -1) {
        state.listJobs.splice(ruleIndex, 1);
      }
    },
    updateRuleItem: (state, action) => {
      const ruleIndex = state.listRules.findIndex(
        (item) => item.rule === action.payload.data.rule
      );
      if (ruleIndex !== -1) {
        state.listRules[ruleIndex] = action.payload.data;
      }
    },
    setSelectedRule: (state, action) => {
      state.selectedRule = action.payload.data;
    },
  },
  extraReducers: (builder) => {},
});

export const rulesSelect = (state) => state.rules;

export const {
  setListRules,
  addRule,
  removeRuleItem,
  updateRuleItem,
  setSelectedRule,
} = rulesSlice.actions;

export default rulesSlice.reducer;
