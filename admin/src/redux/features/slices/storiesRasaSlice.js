import { createSlice } from "@reduxjs/toolkit";

const storiesSlice = createSlice({
  name: "stories",
  initialState: {
    listStories: [],
    selectedStory: null,
  },
  reducers: {
    setListStories: (state, action) => {
      state.listStories = action.payload.data;
      if (action.payload.data && !state.selectedStory)
        state.selectedStory = action.payload?.data[0];
    },
    addStory: (state, action) => {
      state.listStories.push(action.action.data);
    },
    removeStoryItem: (state, action) => {
      const storyIndex = state.listStories.findIndex(
        (item) => item.story === action.payload.data.story
      );
      if (storyIndex !== -1) {
        state.listJobs.splice(storyIndex, 1);
      }
    },
    updateStoryItem: (state, action) => {
      const storyIndex = state.listStories.findIndex(
        (item) => item.story === action.payload.data.story
      );
      if (storyIndex !== -1) {
        state.listStories[storyIndex] = action.payload.data;
      }
    },
    setSelectedStory: (state, action) => {
      state.selectedStory = action.payload.data;
    },
  },
  extraReducers: (builder) => {},
});

export const storiesSelect = (state) => state.stories;

export const {
  setListStories,
  addStory,
  removeStoryItem,
  updateStoryItem,
  setSelectedStory,
} = storiesSlice.actions;

export default storiesSlice.reducer;
