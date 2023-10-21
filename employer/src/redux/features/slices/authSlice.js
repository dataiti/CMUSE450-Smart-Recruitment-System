import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
    accessToken: null,
    refreshToken: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.isLoggedIn = action.payload.user ? true : false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    updateUser: (state, action) => {
      state.user.ownerEmployerId = action.payload.data;
    },
  },
  extraReducers: (builder) => {},
});

export const authSelect = (state) => state.auth;

export const { setCredentials, logOut, updateUser } = authSlice.actions;

export default authSlice.reducer;
