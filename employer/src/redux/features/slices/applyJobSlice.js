import { createSlice } from "@reduxjs/toolkit";

const applyJobSlice = createSlice({
  name: "applyJob",
  initialState: {
    listApplyJobs: [],
    totalPage: 0,
    currentPage: 0,
    count: 0,
  },
  reducers: {
    setListApplyJobs: (state, action) => {
      state.listApplyJobs = action.payload.data;
      state.totalPage = action.payload.totalPage;
      state.currentPage = action.payload.currentPage;
      state.count = action.payload.count;
    },
  },
  extraReducers: (builder) => {},
});

export const applyJobSelect = (state) => state.applyJob;

export const { setListApplyJobs } = applyJobSlice.actions;

export default applyJobSlice.reducer;
