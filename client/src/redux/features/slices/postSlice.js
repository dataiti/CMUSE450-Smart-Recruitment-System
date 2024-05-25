import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "job",
  initialState: {
    posts: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload.data;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.action.data);
    },
    removePostItem: (state, action) => {
      const postId = action.payload._id;
      const postIndex = state.posts.findIndex((item) => item._id === postId);

      if (postIndex !== -1) {
        state.posts.splice(postIndex, 1);
      }
    },
    updatePostItem: (state, action) => {
      const postId = action.payload.data._id;
      const postIndex = state.posts.findIndex((item) => item._id === postId);

      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload.data;
      }
    },
  },
  extraReducers: (builder) => {},
});

export const postSelect = (state) => state.post;

export const { setPosts, addPost, removePostItem, updatePostItem } =
  postSlice.actions;

export default postSlice.reducer;
