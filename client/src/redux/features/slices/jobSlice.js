import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    listJobs: [],
    totalPage: 0,
    currentPage: 0,
    count: 0,
  },
  reducers: {
    setListJobs: (state, action) => {
      state.listJobs = action.payload.data;
      state.totalPage = action.payload.totalPage;
      state.currentPage = action.payload.currentPage;
      state.count = action.payload.count;
    },
  },
  extraReducers: (builder) => {},
});

export const jobSelect = (state) => state.job;

export const { setListJobs } = jobSlice.actions;

export default jobSlice.reducer;
