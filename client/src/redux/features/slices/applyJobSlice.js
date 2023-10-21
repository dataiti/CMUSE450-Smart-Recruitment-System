import { createSlice } from "@reduxjs/toolkit";

const applyJobSlice = createSlice({
  name: "job",
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
    addApplyJob: (state, action) => {
      state.listApplyJobs.unshift(action.action.data);
    },
    removeApplyJobItem: (state, action) => {
      const jobId = action.payload._id;
      const jobIndex = state.listApplyJobs.findIndex(
        (item) => item._id === jobId
      );

      if (jobIndex !== -1) {
        state.listApplyJobs.splice(jobIndex, 1);
      }
    },
    updateApplyJobItem: (state, action) => {
      const jobId = action.payload.data._id;
      const jobIndex = state.listApplyJobs.findIndex(
        (item) => item._id === jobId
      );

      if (jobIndex !== -1) {
        state.listApplyJobs[jobIndex] = action.payload.data;
      }
    },
    updateHiringStatusJob: (state, action) => {
      const jobId = action.payload.data._id;
      const jobIndex = state.listApplyJobs.findIndex(
        (item) => item._id === jobId
      );

      if (jobIndex !== -1) {
        state.listApplyJobs[jobIndex].isHiring =
          !state.listApplyJobs[jobIndex].isHiring;
      }
    },
  },
  extraReducers: (builder) => {},
});

export const jobSelect = (state) => state.job;

export const {
  removeJobItem,
  updateJobItem,
  setListApplyJobs,
  addJob,
  updateHiringStatusJob,
} = applyJobSlice.actions;

export default applyJobSlice.reducer;
