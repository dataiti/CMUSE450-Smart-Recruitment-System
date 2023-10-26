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
    // addEmployer: (state, action) => {
    //   state.listEmployers.unshift(action.action.data);
    // },
    // removeEmployerItem: (state, action) => {
    //   const EmployerId = action.payload._id;
    //   const EmployerIndex = state.listEmployers.findIndex((item) => item._id === EmployerId);

    //   if (EmployerIndex !== -1) {
    //     state.listEmployers.splice(EmployerIndex, 1);
    //   }
    // },
    // updateEmployerItem: (state, action) => {
    //   const EmployerId = action.payload.data._id;
    //   const EmployerIndex = state.listEmployers.findIndex((item) => item._id === EmployerId);

    //   if (EmployerIndex !== -1) {
    //     state.listEmployers[EmployerIndex] = action.payload.data;
    //   }
    // },
    // updateHiringStatusEmployer: (state, action) => {
    //   const EmployerId = action.payload.data._id;
    //   const EmployerIndex = state.listEmployers.findIndex((item) => item._id === EmployerId);

    //   if (EmployerIndex !== -1) {
    //     state.listEmployers[EmployerIndex].isHiring = !state.listEmployers[EmployerIndex].isHiring;
    //   }
    // },
  },
  extraReducers: (builder) => {},
});

export const employerSelect = (state) => state.employer;

export const {
  setListEmployers,
  // removeEmployerItem,
  // updateEmployerItem,
  // addEmployer,
  // updateHiringStatusEmployer,
} = employerSlice.actions;

export default employerSlice.reducer;
