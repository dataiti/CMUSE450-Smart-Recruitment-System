import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    listUsers: [],
    totalPage: 0,
    currentPage: 0,
    count: 0,
  },
  reducers: {
    setListUsers: (state, action) => {
      state.listUsers = action.payload.data;
      state.totalPage = action.payload.totalPage;
      state.currentPage = action.payload.currentPage;
      state.count = action.payload.count;
    },
  },
  extraReducers: (builder) => {},
});

export const userSelect = (state) => state.user;

export const { setListUsers } = userSlice.actions;

export default userSlice.reducer;
