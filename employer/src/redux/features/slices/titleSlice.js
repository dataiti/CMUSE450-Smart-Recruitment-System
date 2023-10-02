import { createSlice } from "@reduxjs/toolkit";

const titleSlice = createSlice({
  name: "title",
  initialState: {
    name: "Dashboard",
    path: "/dashboard",
  },
  reducers: {
    setTitle: (state, action) => {
      state.name = action.payload.name;
      state.path = action.payload.path;
    },
    clearTitle: (state) => {
      state.name = "Dashboard";
      state.path = "/dashboard";
    },
  },
  extraReducers: (builder) => {},
});

export const titleSelect = (state) => state.title;

export const { setTitle, clearTitle } = titleSlice.actions;

export default titleSlice.reducer;
