import { createSlice } from "@reduxjs/toolkit";

const titleSlice = createSlice({
  name: "title",
  initialState: {
    name: "Dashboard",
  },
  reducers: {
    setTitle: (state, action) => {
      state.name = action.payload;
    },
    clearTitle: (state) => {
      state.name = "Dashboard";
    },
  },
  extraReducers: (builder) => {},
});

export const titleSelect = (state) => state.title;

export const { setTitle, clearTitle } = titleSlice.actions;

export default titleSlice.reducer;
