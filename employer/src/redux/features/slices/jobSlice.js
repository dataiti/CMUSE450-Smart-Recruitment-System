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
    addJob: (state, action) => {
      state.listJobs.unshift(action.action.data);
    },
    removeJobItem: (state, action) => {
      const jobId = action.payload._id;
      const jobIndex = state.listJobs.findIndex((item) => item._id === jobId);

      if (jobIndex !== -1) {
        state.listJobs.splice(jobIndex, 1);
      }
    },
    updateJobItem: (state, action) => {
      const jobId = action.payload.data._id;
      const jobIndex = state.listJobs.findIndex((item) => item._id === jobId);

      if (jobIndex !== -1) {
        state.listJobs[jobIndex] = action.payload.data;
      }
    },
    updateHiringStatusJob: (state, action) => {
      const jobId = action.payload.data._id;
      const jobIndex = state.listJobs.findIndex((item) => item._id === jobId);

      if (jobIndex !== -1) {
        state.listJobs[jobIndex].isHiring = !state.listJobs[jobIndex].isHiring;
      }
    },
  },
  extraReducers: (builder) => {},
});

export const jobSelect = (state) => state.job;

export const {
  removeJobItem,
  updateJobItem,
  setListJobs,
  addJob,
  updateHiringStatusJob,
} = jobSlice.actions;

export default jobSlice.reducer;
