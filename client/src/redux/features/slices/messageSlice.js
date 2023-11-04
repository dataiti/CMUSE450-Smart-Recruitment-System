import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    conversationId: null,
    conversations: [],
    currentConversation: null,
    currentMessages: [],
  },
  reducers: {
    setListConversations: (state, action) => {
      state.conversations = action.payload.conversations.map((item) => {
        const user = item.participants.find(
          (elm) => elm._id.toString() !== action.payload.userId.toString()
        );

        return {
          _id: item._id,
          sender: { ...user },
          lastMessages: item.messages[item.messages.length - 1],
        };
      });
    },
    updateConversations: (state, action) => {},
    addConversations: (state, action) => {},
    setCurrentConversation: (state, action) => {},
    setCurrentMessage: (state, action) => {
      state.conversationId = action.payload.messageData._id;
      state.currentConversation = action.payload.messageData.participants.find(
        (item) => item._id?.toString() !== action.payload.userId?.toString()
      );
      state.currentMessages = action.payload.messageData?.messages?.map(
        (message) => {
          const messageText = message.text;
          const incoming =
            message.to._id?.toString() === action.payload.userId?.toString();
          const outgoing =
            message.from._id?.toString() === action.payload.userId?.toString();

          return {
            type: "text",
            message: messageText,
            incoming,
            outgoing,
          };
        }
      );
    },
  },
  extraReducers: (builder) => {},
});

export const messageSelect = (state) => state.message;

export const {
  setListConversations,
  updateConversations,
  addConversations,
  setCurrentMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
