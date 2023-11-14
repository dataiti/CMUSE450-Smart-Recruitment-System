import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    listConversations: [],
    currentConversation: null,
    currentMessages: [],
  },
  reducers: {
    setListConversations: (state, action) => {
      state.listConversations = action.payload.data;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload.data;
    },
  },
  extraReducers: (builder) => {},
});

export const messageSelect = (state) => state.message;

export const { setListConversations, setCurrentConversation } =
  messageSlice.actions;

export default messageSlice.reducer;
