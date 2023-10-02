import { createSlice } from "@reduxjs/toolkit";

const employerSlice = createSlice({
  name: "auth",
  initialState: {
    employer: null,
  },
  reducers: {
    setEmployerInformation: (state, action) => {
      state.employer = action.payload.data;
    },
    resetEmployerInformation: (state) => {
      state.employer = null;
    },
  },
  extraReducers: (builder) => {},
});

export const employerSelect = (state) => state.employer;

export const { setEmployerInformation, resetEmployerInformation } =
  employerSlice.actions;

export default employerSlice.reducer;
