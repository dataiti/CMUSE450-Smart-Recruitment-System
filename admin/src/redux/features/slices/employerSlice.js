import { createSlice } from "@reduxjs/toolkit";

const employerSlice = createSlice({
  name: "employer",
  initialState: {
    listEmployers: [],
    totalPage: 0,
    currentPage: 0,
    count: 0,
  },
  reducers: {
    setListEmployers: (state, action) => {
      state.listEmployers = action.payload.data;
      state.totalPage = action.payload.totalPage;
      state.currentPage = action.payload.currentPage;
      state.count = action.payload.count;
    },
    addEmployer: (state, action) => {
      state.listEmployers.unshift(action.action.data);
    },
    removeEmployerItem: (state, action) => {
      const employerId = action.payload._id;
      const employerIndex = state.listEmployers.findIndex(
        (item) => item._id === employerId
      );

      if (employerIndex !== -1) {
        state.listEmployers.splice(employerIndex, 1);
      }
    },
    // updateEmployerItem: (state, action) => {
    //   const EmployerId = action.payload.data._id;
    //   const EmployerIndex = state.listEmployers.findIndex((item) => item._id === EmployerId);

    //   if (EmployerIndex !== -1) {
    //     state.listEmployers[EmployerIndex] = action.payload.data;
    //   }
    // },
    updateToggleLockEmployer: (state, action) => {
      const employerId = action.payload.data._id;
      const employerIndex = state.listEmployers.findIndex(
        (item) => item._id === employerId
      );

      if (employerIndex !== -1) {
        state.listEmployers[employerIndex].isLocked =
          !state.listEmployers[employerIndex].isLocked;
      }
    },
  },
  extraReducers: (builder) => {},
});

export const employerSelect = (state) => state.employer;

export const {
  setListEmployers,
  removeEmployerItem,
  // updateEmployerItem,
  addEmployer,
  updateToggleLockEmployer,
} = employerSlice.actions;

export default employerSlice.reducer;
